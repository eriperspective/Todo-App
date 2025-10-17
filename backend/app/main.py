from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import sys
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app with explicit docs configuration
app = FastAPI(
    title="Todo App API",
    description="A simple todo application API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS setup - more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
        "http://localhost:8000"
    ],  # Frontend URLs and local access
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Health check route
@app.get("/", tags=["health"])
def read_root():
    logger.info("Health check endpoint accessed")
    return {"message": "Hello, FastAPI!", "status": "healthy"}

# Setup path for route imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Add exception handler for better error reporting
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

# Add handler for validation errors
from fastapi import Request
from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=400,
        content={
            "detail": exc.errors(),
            "message": "Validation failed"
        }
    )

# Mount routers
try:
    logger.info("Loading auth routes...")
    from routes import auth_routes
    app.include_router(auth_routes.router, tags=["auth"])
    logger.info("Auth routes loaded successfully")
except Exception as e:
    logger.error(f"Failed to load auth routes: {e}")
    import traceback
    traceback.print_exc()

try:
    logger.info("Loading task routes...")
    from routes import task_routes
    app.include_router(task_routes.router, prefix="/api", tags=["tasks"])
    logger.info("Task routes loaded successfully")
except Exception as e:
    logger.error(f"Failed to load task routes: {e}")
    import traceback
    traceback.print_exc()

try:
    logger.info("Loading label routes...")
    from routes import label_routes
    app.include_router(label_routes.router, prefix="/api", tags=["labels"])
    logger.info("Label routes loaded successfully")
except Exception as e:
    logger.error(f"Failed to load label routes: {e}")
    import traceback
    traceback.print_exc()

logger.info("FastAPI application initialized successfully")
