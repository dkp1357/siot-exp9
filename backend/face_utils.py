import numpy as np

def compare_faces(stored_descriptor: list, current_descriptor: list, threshold: float = 0.6) -> bool:
    """
    Compare two 128-d face descriptors using Euclidean distance.
    Returns True if they match (distance < threshold).
    face-api.js uses the same distance metric as dlib.
    """
    stored = np.array(stored_descriptor, dtype=np.float64)
    current = np.array(current_descriptor, dtype=np.float64)
    distance = np.linalg.norm(stored - current)
    return float(distance) < threshold

def get_face_distance(stored_descriptor: list, current_descriptor: list) -> float:
    """Return Euclidean distance between two face descriptors."""
    stored = np.array(stored_descriptor, dtype=np.float64)
    current = np.array(current_descriptor, dtype=np.float64)
    return float(np.linalg.norm(stored - current))
