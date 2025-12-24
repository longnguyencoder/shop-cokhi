import sys
from pathlib import Path
sys.path.append(str(Path.cwd()))

try:
    from app.db import base # LOAD ALL MODELS FIRST
    from app.db.session import SessionLocal
    from app.models.category import Category
    from app.schemas.category import CategoryWithChildren
    from app.repositories.category_repository import category_repository
    
    db = SessionLocal()
    print("Fetching root categories...")
    roots = category_repository.get_root_categories(db)
    print(f"Found {len(roots)} root categories.")
    
    for root in roots:
        print(f"Processing root: {root.name}")
        # Try to serialize
        schema_obj = CategoryWithChildren.model_validate(root)
        print(f"Serialized: {schema_obj.model_dump_json(indent=2)}")
        
    db.close()
    print("Test completed successfully.")
except Exception as e:
    import traceback
    print("ERROR CAUGHT:")
    traceback.print_exc()
    sys.exit(1)
