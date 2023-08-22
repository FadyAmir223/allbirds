import json
import urllib.request
import time
import os
import random


with open("bird.json") as json_file:
    objects = json.load(json_file)

new_objects = []

def handle_request(src, dest):
    if not os.path.exists(dest):
        os.makedirs(dest)

    img_name = src.split("?")[0].split("/")[-1]
    if "." not in img_name:
        img_name += ".png"

    if not os.path.exists(os.path.join(dest, img_name)):
        try:
            urllib.request.urlretrieve("https:" + src, dest + img_name)
            print("Image downloaded")
            time.sleep(random.uniform(1, 2))
        except:
            print("Image not found")
    else:
        print("Image already exists")

for obj in objects:
    new_obj = {}
    new_obj.update(obj)

    recommendations = []
    for recommendation in obj["recommendations"]:
        dest_folder = f"images/collections/{obj['type']}/{obj['gender']}/{obj['handle']}/recommendations/"
        handle_request(recommendation["image"], dest_folder)
        recommendation["image"] = dest_folder + recommendation["image"].split("?")[0].split("/")[-1]
        recommendations.append(recommendation)
    new_obj["recommendations"] = recommendations

    material_features = []
    for material_feature in obj["material_features"]:
        dest_folder = f"images/collections/{obj['type']}/{obj['gender']}/{obj['handle']}/material_features/"
        handle_request(material_feature["image"], dest_folder)
        material_feature["image"] = dest_folder + material_feature["image"].split("?")[0].split("/")[-1]
        material_features.append(material_feature)
    new_obj["material_features"] = material_features

    editions = []
    for edition in obj["editions"]:
        new_edition = {}
        new_edition.update(edition)
        products = []
        for product in edition["products"]:
            new_product = {}
            new_product.update(product)
            images = []
            for image in product["images"]:
                dest_folder = f"images/collections/{obj['type']}/{obj['gender']}/{obj['handle']}/editions/{edition['edition']}/{product['handle']}/"
                handle_request(image, dest_folder)
                images.append(dest_folder + image.split("?")[0].split("/")[-1])
            new_product["images"] = images
            products.append(new_product)
        new_edition["products"] = products
        editions.append(new_edition)
    new_obj["editions"] = editions

    new_objects.append(new_obj)

# Save the new objects to a file
with open("new_bird.json", "w") as json_file:
    json.dump(new_objects, json_file, indent=4)
