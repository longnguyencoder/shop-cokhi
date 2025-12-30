import socketio

# Create a Socket.IO server
# async_mode='asgi' is used for integration with FastAPI (which is ASGI)
# cors_allowed_origins='*' allows connections from any origin (e.g., your React frontend)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')

# Create an ASGI application
# This wraps the Socket.IO server into an ASGI app that can be mounted by FastAPI
app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ):
    """
    Handle new client connections.
    sid: Session ID of the client
    environ: Request environment details
    """
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    """
    Handle client disconnections.
    """
    print(f"Client disconnected: {sid}")

async def emit_to_all(event: str, data: dict):
    """
    Helper function to broadcast an event to all connected clients.
    """
    await sio.emit(event, data)
