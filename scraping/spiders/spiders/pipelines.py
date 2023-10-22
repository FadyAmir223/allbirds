# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
# import pymongo


class RestDataCleaningPipeline:
    def process_item(self, item, spider):
        return item


# class MongoDBPipeline:
#     def __init__(self, mongodb_uri, mongodb_db, mongodb_collection):
#         self.mongodb_uri = mongodb_uri
#         self.mongodb_db = mongodb_db
#         self.mongodb_collection = mongodb_collection

#     @classmethod
#     def from_crawler(cls, crawler):
#         mongodb_uri = crawler.settings.get('MONGODB_URI')
#         mongodb_db = crawler.settings.get('MONGODB_DB')
#         mongodb_collection = crawler.settings.get('MONGODB_COLLECTION')
#         return cls(mongodb_uri, mongodb_db, mongodb_collection)

#     def open_spider(self, spider):
#         self.client = pymongo.MongoClient(self.mongodb_uri)
#         self.db = self.client[self.mongodb_db]
#         self.collection = self.db[self.mongodb_collection]

#     def close_spider(self, spider):
#         self.client.close()

#     def process_item(self, item, spider):
#         self.collection.insert_one(dict(item))
#         return item
