export const Workflow = {
    // Keys
    KEY_REQUESTS: 'parkingRequests',

    // Read
    getAll: () => {
        return JSON.parse(localStorage.getItem(Workflow.KEY_REQUESTS) || '[]');
    },

    getPending: () => {
        const all = Workflow.getAll();
        // Return initial requests OR retrieval requests that are NOT yet assigned to a valet
        return all.filter(r => (r.status === 'requested' || r.status === 'retrieval_requested') && !r.valetId);
    },

    getUserActiveRequests: (userId) => {
        const all = Workflow.getAll();
        // Return requests that are active (not cancelled, archived, or completed)
        return all.filter(r => r.userId === userId && r.status !== 'archived' && r.status !== 'completed').sort((a, b) => b.id - a.id);
    },

    getDriverActive: (driverId) => {
        const all = Workflow.getAll();
        return all.find(r => r.valetId === driverId && r.status !== 'completed' && r.status !== 'archived');
    },

    getActive: (userId) => {
        const all = Workflow.getAll();
        // Return the most recent active request for the user
        return all.filter(r => r.userId === userId && r.status !== 'completed' && r.status !== 'archived')
            .sort((a, b) => b.id - a.id)[0];
    },

    // Actions
    createRequest: (user, vehicle, location) => {
        const all = Workflow.getAll();
        const newRequest = {
            id: Date.now(),
            userId: user.id || 999,
            userName: user.name || 'Unknown User',
            userPhone: user.phone || '9999999999',
            vehicle: vehicle, // { plate, model }
            location: location,
            status: 'requested', // requested -> assigned -> parked -> retrieval_requested -> retrieving -> completed
            timestamp: new Date().toISOString()
        };
        all.push(newRequest);
        localStorage.setItem(Workflow.KEY_REQUESTS, JSON.stringify(all));
        return newRequest;
    },

    acceptRequest: (requestId, driver) => {
        const all = Workflow.getAll();
        const idx = all.findIndex(r => r.id === requestId);
        if (idx !== -1) {
            // Only change to 'assigned' if it was 'requested'. 
            // If it was 'retrieval_requested', keep it as is (just changing valet).
            if (all[idx].status === 'requested') {
                all[idx].status = 'assigned';
            }
            all[idx].valetId = driver.id;
            all[idx].valetName = driver.name;
            localStorage.setItem(Workflow.KEY_REQUESTS, JSON.stringify(all));
        }
    },

    updateStatus: (requestId, newStatus) => {
        const all = Workflow.getAll();
        const idx = all.findIndex(r => r.id === requestId);
        if (idx !== -1) {
            all[idx].status = newStatus;

            // If retrieval requested, clear valet assignment so any driver can pick it up
            if (newStatus === 'retrieval_requested') {
                all[idx].valetId = null;
                all[idx].valetName = null;
            }

            // Capture Parked Time (Actual Entry)
            if (newStatus === 'parked' && !all[idx].parkedTimestamp) {
                all[idx].parkedTimestamp = new Date().toISOString();
            }

            // Capture Exit Time if completing
            if (newStatus === 'completed') {
                all[idx].exitTimestamp = new Date().toISOString();
            }
            localStorage.setItem(Workflow.KEY_REQUESTS, JSON.stringify(all));
        }
    }
};
