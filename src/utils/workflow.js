// Helper to fetch data
const api = {
    get: async (url) => {
        const res = await fetch(url);
        return res.json();
    },
    post: async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    patch: async (url, data) => {
        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};

export const Workflow = {
    // Read
    getAll: async () => {
        try {
            return await api.get('/api/requests');
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getPending: async () => {
        const all = await Workflow.getAll();
        return all.filter(r => (r.status === 'requested' || r.status === 'retrieval_requested') && !r.valetId);
    },

    getUserActiveRequests: async (userId) => {
        const all = await Workflow.getAll();
        return all.filter(r => r.userId === userId && r.status !== 'archived' && r.status !== 'completed').sort((a, b) => b.id - a.id);
    },

    getDriverActive: async (driverId) => {
        const all = await Workflow.getAll();
        return all.find(r => r.valetId === driverId && r.status !== 'completed' && r.status !== 'archived');
    },

    getActive: async (userId) => {
        const all = await Workflow.getAll();
        return all.filter(r => r.userId === userId && r.status !== 'completed' && r.status !== 'archived')
            .sort((a, b) => b.id - a.id)[0];
    },

    // Actions
    createRequest: async (user, vehicle, location) => {
        const newRequest = {
            id: Date.now(),
            userId: user.id || 999,
            userName: user.name || 'Unknown User',
            userPhone: user.phone || '9999999999',
            vehicle: vehicle,
            location: location,
            status: 'requested',
            timestamp: new Date().toISOString()
        };
        return await api.post('/api/requests', newRequest);
    },

    acceptRequest: async (requestId, driver) => {
        // First get the request to check status if needed, but for now just patch
        // We replicate logic: if 'requested', set 'assigned'.
        // To be safe we could fetch first, but patching is optimistic.
        // Actually, backend accepts patch.
        // We'll just patch the valet fields. The backend doesn't have the "only if requested" logic I put in JS earlier.
        // Let's do a smart patch:
        // We can't conditionally patch based on current state easily with one call unless backend supports it.
        // But the previous JS logic was: if requested -> assigned. if retrieval_requested -> just assigned (status stays retrieval_requested).

        // Let's fetch first to be safe
        const requests = await Workflow.getAll();
        const req = requests.find(r => r.id === requestId);
        if (req) {
            const updates = {
                valetId: driver.id,
                valetName: driver.name
            };
            if (req.status === 'requested') {
                updates.status = 'assigned';
            }
            return await api.patch(`/api/requests/${requestId}`, updates);
        }
    },

    updateStatus: async (requestId, newStatus) => {
        const updates = { status: newStatus };

        // If retrieval requested, clear valet assignment
        if (newStatus === 'retrieval_requested') {
            updates.valetId = null;
            updates.valetName = null;
        }

        // Capture Parked Time
        if (newStatus === 'parked') {
            // Check if parkedTimestamp exists? We can't easily. Just send it if newStatus is parked.
            // Or better: backend could handle this? Backend is dumb storage.
            // Let's just send it. If it overwrites, it's fine (usually start of parking).
            updates.parkedTimestamp = new Date().toISOString();
        }

        // Capture Exit Time
        if (newStatus === 'completed') {
            updates.exitTimestamp = new Date().toISOString();
        }

        return await api.patch(`/api/requests/${requestId}`, updates);
    }
};
