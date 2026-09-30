import math
from typing import List, Tuple, Dict, Any

def is_polygon_closed(coords: List[List[float]]) -> bool:
    """Ensure first and last points are identical."""
    if not coords or len(coords) < 3:
        return False
    return coords[0] == coords[-1]

def calculate_approx_area(coords: List[List[float]]) -> float:
    """Shoelace formula approximation for polygon area in square meters."""
    if len(coords) < 3:
        return 0.0
    total = 0.0
    radius = 6378137.0 # Earth radius in meters

    for i in range(len(coords) - 1):
        p1 = coords[i]
        p2 = coords[i + 1]
        lat1 = math.radians(p1[1])
        lat2 = math.radians(p2[1])
        lon1 = math.radians(p1[0])
        lon2 = math.radians(p2[0])
        total += (lon2 - lon1) * (2 + math.sin(lat1) + math.sin(lat2))

    total = total * radius * radius / 2.0
    return abs(total)

def get_bbox(coords: List[List[float]]) -> Dict[str, float]:
    min_x = min(p[0] for p in coords)
    max_x = max(p[0] for p in coords)
    min_y = min(p[1] for p in coords)
    max_y = max(p[1] for p in coords)
    return {"min_lng": min_x, "max_lng": max_x, "min_lat": min_y, "max_lat": max_y}

def bboxes_intersect(box_a: Dict[str, float], box_b: Dict[str, float]) -> bool:
    return not (
        box_a["max_lng"] < box_b["min_lng"] or
        box_a["min_lng"] > box_b["max_lng"] or
        box_a["max_lat"] < box_b["min_lat"] or
        box_a["min_lat"] > box_b["max_lat"]
    )
