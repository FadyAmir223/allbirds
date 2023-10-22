import scrapy
import re


class AudiobookSpider(scrapy.Spider):
    name = "books"
    allowed_domains = ["findaudiobook.com"]
    start_urls = ["https://findaudiobook.com/page/1"]

    custom_settings = {
        "FEEDS": {"audiobooks.json": {"format": "json", "overwrite": True}}
    }

    def parse(self, response):
        items = response.css(".entry.clearfix")
        for item in items:
            book_non_clean = item.css("strong::text").get()
            if book_non_clean is not None:
                yield {
                    "name": self.clean_data(book_non_clean),
                    "record": item.css("source::attr(src)").getall(),
                }

        next_url = response.css(".next::attr(href)").get()
        if next_url:
            yield scrapy.Request(next_url, callback=self.parse)

    def clean_data(self, book_name):
        book_name = re.sub("[“”]", "", book_name.replace("Audiobook", "").strip())
        pattern = re.compile(r"^(.*?)(?:\s*–\s*|\s*by\s*)(.*?)(?:\s*Audiobook)?\s*$")
        match = re.match(pattern, book_name)

        if match:
            if "by" in match.group(1):
                book_details = {"book": match.group(1), "author": match.group(2)}
            else:
                book_details = {"book": match.group(2), "author": match.group(1)}
        else:
            book_details = {"book": book_name}

        return book_details
