// Factory function that receives the Socket.IO instance (io)
// Allows us to emit socket events from inside Express middleware
function createSocketBroadcaster(io) {

    // Return Express middleware
    return (req, res, next) => {

        // Only broadcast for data-changing HTTP methods
        const broadcastMethods = ['POST', 'PUT', 'DELETE'];

        // Skip non-mutating requests
        if (!broadcastMethods.includes(req.method)) {
            return next();
        }

        // IMPORTANT:
        // req.body is available here IF express.json() ran earlier
        const requestBody = req.body;

        // Keep reference to original res.send
        const originalSend = res.send.bind(res);

        // Override res.send to intercept response payload
        res.send = function (body) {

            let parsedResponse;

            try {
                // Handle stringified JSON responses
                if (typeof body === 'string' && body.startsWith('{')) {
                    parsedResponse = JSON.parse(body);
                } else {
                    parsedResponse = body;
                }

                // Only broadcast successful responses with data
                if (parsedResponse?.success === true && parsedResponse.data) {

                    // Remove query string from URL
                    const cleanPath = req.originalUrl.split('?')[0];

                    // Split URL into segments
                    const segments = cleanPath.split('/').filter(Boolean);

                    // Determine module / route key
                    // Example: /api/data-sheet/create → "data-sheet"
                    const routeKey = segments[0] || '';

                    // Emit event to all connected clients
                    io.emit('api_broadcast', {
                        type: req.method.toLowerCase(),  // post | put | delete
                        route: routeKey,

                        // Request data sent by client
                        data: requestBody,

                        // Response data returned by API
                        response: parsedResponse.data,

                        // Optional user info
                        userEmail: req.user[0].email || null,

                        // Timestamp
                        time: new Date().toISOString(),
                    });
                }

            } catch (err) {
                // Never allow broadcast failure to break API
                console.warn('[Socket Broadcast Warning]', err.message);
            }

            // Send response to client normally
            return originalSend(body);
        };

        // Continue request lifecycle
        next();
    };
}

// Export middleware factory
module.exports = createSocketBroadcaster;
