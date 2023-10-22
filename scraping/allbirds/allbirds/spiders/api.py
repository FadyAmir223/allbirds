import scrapy
from scrapy_playwright.page import PageMethod
from playwright._impl._api_types import TimeoutError

import asyncio
import markdownify
from random import uniform, randint
from datetime import datetime
import requests


class ApiSpider(scrapy.Spider):
    name = "api"
    start_url = "https://www.allbirds.com"

    custom_settings = {
        "FEEDS": {"allbirds-api.json": {"format": "json", "overwrite": True}},
        "CONCURRENT_REQUESTS": 5,
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 5,
        "AUTOTHROTTLE_MAX_DELAY": 20,
        "AUTOTHROTTLE_TARGET_CONCURRENCY": 4.0,
    }

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()

    def start_requests(self):
        for collection in ["mens", "womens", "socks"]:
            yield scrapy.Request(
                f"{self.start_url}/collections/{collection}",
                callback=self.parse_collection,
                meta=dict(
                    playwright=True,
                    playwright_include_page=True,
                    errback=self.errback,
                    playwright_page_methods=[
                        PageMethod(
                            "wait_for_selector", ".Grid__item--CHILD_COLLECTION a"
                        )
                    ],
                ),
            )

    async def parse_collection(self, response):
        page = response.meta["playwright_page"]
        await page.close()

        for url in response.css(".Grid__item--CHILD_COLLECTION a::attr(href)").getall():
            yield scrapy.Request(
                self.start_url + url,
                callback=self.parse_product,
                meta=dict(
                    playwright=True,
                    playwright_include_page=True,
                    errback=self.errback,
                ),
            )

    async def parse_product(self, response):
        page = response.meta["playwright_page"]

        try:
            popup = page.locator(".ReactModal__Content")
            await popup.wait_for(state="attached", timeout=10000)
            close_btn = popup.locator(".Modal__close--big button")
            await close_btn.click()
            await asyncio.sleep(uniform(0.5, 1))

        except TimeoutError:
            pass

        finally:
            # free shipping
            free_shipping = (
                response.css(".PdpFreeShippingIndicatorDesktop::text").get() is not None
            )

            # highlights
            highlights_locator = page.locator(".PdpDifferentiators p")
            highlights_list = []

            for i in range(await highlights_locator.count()):
                highlight_locator = highlights_locator.nth(i)
                highlight = await highlight_locator.text_content()
                highlight = highlight.strip().lower()
                highlights_list.append(highlight)

            # dropdown
            dropdown_list = []
            dropdowns_locator = page.locator(".PdpAttributes__dropdown")
            first_iteration = True

            for i in range(await dropdowns_locator.count()):
                dropdown_locator = dropdowns_locator.nth(i)

                dropdown_title_locator = dropdown_locator.locator(
                    ".typography--senary-heading"
                )
                dropdown_title = await dropdown_title_locator.text_content()

                dropdown_button_locator = dropdown_locator.locator(".Dropdown__header")
                await dropdown_button_locator.scroll_into_view_if_needed()
                if not first_iteration:
                    await dropdown_button_locator.click()
                    await asyncio.sleep(uniform(1, 2))
                first_iteration = False

                try:
                    dropdown_content_locator = dropdown_locator.locator(
                        ".Dropdown__accordion-content"
                    )
                    dropdown_content = await dropdown_content_locator.inner_html()
                    markdown_text = markdownify.markdownify(dropdown_content).strip()
                    dropdown_list.append(
                        {"title": dropdown_title, "content": markdown_text}
                    )
                except:
                    pass

            # recommendations
            try:
                recommendations_list = []
                recommendations_locator = page.locator(".PdpSidebarRecs-cards")
                await recommendations_locator.scroll_into_view_if_needed()
                recommendations_locator = recommendations_locator.locator("a")

                for i in range(await recommendations_locator.count()):
                    reommendation_locator = recommendations_locator.nth(i)

                    ### text
                    reommendation_text_locator = reommendation_locator.locator("b")
                    reommendation_text = await reommendation_text_locator.text_content()

                    ### image
                    reommendation_img_locator = reommendation_locator.locator("image")
                    reommendation_img = await reommendation_img_locator.get_attribute(
                        "src"
                    )

                    recommendations_list.append(
                        {"name": reommendation_text, "image": reommendation_img}
                    )
            except:
                pass

            # material features
            try:
                material_features_list = []
                material_features_locator = page.locator(
                    ".PdpProductPart__content-container"
                )

                try:
                    for i in range(await material_features_locator.count()):
                        material_feature_locator = material_features_locator.nth(i)

                        ### text
                        h4_locator = material_feature_locator.locator("h4")
                        h4 = await h4_locator.text_content()
                        h4 = h4.strip().lower()

                        h2_locator = material_feature_locator.locator("h2")
                        h2 = await h2_locator.text_content()
                        h2 = h2.strip().lower()

                        p_locator = material_feature_locator.locator("p")
                        p = await p_locator.text_content()
                        p = p.strip().lower()

                        ### img
                        img_locator = material_feature_locator.locator(
                            ".PdpProductPart__image-medium-up"
                        )
                        await img_locator.scroll_into_view_if_needed()
                        await asyncio.sleep(uniform(0.5, 1))
                        img_src = await img_locator.get_attribute("src")

                        material_features_list.append(
                            {
                                "image": img_src,
                                "text": {"h4": h4, "h2": h2, "p": p},
                            }
                        )
                except:
                    pass
            except:
                pass

            # product
            title_locator = page.locator("h1.PdpMasterProductDetails__heading")
            title = await title_locator.text_content()
            title = title.strip().replace("'", "").replace(" ", "-").lower()

            data = requests.get(
                f"https://www.allbirds.com/collections/{title}?view=master-product"
            ).json()

            products = data["products"]
            first_product = list(products.values())[-1]

            product_dict = {
                "name": data["name"],
                "price": int(
                    (first_product.get("compareAtPrice") or first_product["price"])
                    / 100
                ),
                "type": first_product["type"],
                "gender": first_product["gender"],
                "material": first_product["material"],
                "silhouette": first_product["silhouette"],
                "bestFor": first_product["bestFor"],
                "sizes": [
                    size.replace("-", ".") for size in first_product["sizesSortOrder"]
                ],
                "free_shipping": free_shipping,
                "highlights": highlights_list,
                "dropdown": dropdown_list,
                "recommendations": recommendations_list,
                "material_features": material_features_list,
            }

            editions = []
            sale_products = []

            for product in products.values():
                edition = product["edition"]
                product_item = {
                    "id": product["id"],
                    "handle": product["handle"],
                    "colorName": product["colorName"],
                    "colors": product["colors"],
                    "hues": product["hues"],
                    "images": [image["src"] for image in product["images"]],
                }

                if product.get("compareAtPrice") is not None:
                    product_item["salePrice"] = int(product["compareAtPrice"] / 100)
                    sale_products.append(product_item)
                else:
                    for edition_data in editions:
                        if edition_data["edition"] == edition:
                            edition_data["products"].append(product_item)
                            break
                    else:
                        edition_dict = {"edition": edition, "products": [product_item]}
                        editions.append(edition_dict)

                unavailable_sizes = [
                    size["value"]
                    for size in product["sizes"].values()
                    if not size["available"]
                ]
                product_item["sizesSoldOut"] = unavailable_sizes

            if sale_products:
                sale_edition = {"edition": "sale", "products": sale_products}
                editions.append(sale_edition)

            product_dict["editions"] = editions

            # reviews
            product_id = first_product["canonicalProduct"]["id"]
            reviews_count = randint(7, 20)

            data = requests.get(
                f"https://api.yotpo.com/v1/widget/585GJuHRuzgJCCJRTaZzsz5CeVQQTgMTztAUG6DD/products/{product_id}/reviews.json?page=1&per_page={reviews_count}"
            ).json()

            reviews_data = data["response"]
            reviews_pagination = reviews_data["pagination"]
            reviews_bottomline = reviews_data["bottomline"]
            reviews_list = reviews_data["reviews"]

            reviews = {
                "count": reviews_pagination["per_page"],
                "rating": round(reviews_bottomline["average_score"], 1),
                "reviews": [],
            }

            for review in reviews_list:
                review_dict = {
                    "score": review["score"],
                    "title": review["title"],
                    "content": review["content"],
                    "username": review["user"]["display_name"],
                    "verifiedBuyer": review["verified_buyer"],
                    "createdAt": datetime.strptime(
                        review["created_at"], "%Y-%m-%dT%H:%M:%S.%fZ"
                    ).strftime("%B %d, %Y"),
                }

                custom_fields = []
                typical_width = {1: "Narrow", 2: "Average", 3: "Wide"}
                overall_fit = {1: "Runs Small", 2: "Just Right", 3: "Runs Big"}

                try:
                    for field in review["custom_fields"].values():
                        title = field["title"]
                        value = field["value"]

                        if title == "Typical Width":
                            value = typical_width.get(value, value)

                        if title == "Overall Fit":
                            value = overall_fit.get(value, value)

                        custom_fields.append({"title": title, "value": value})
                except:
                    pass

                review_dict["custom_fields"] = custom_fields
                reviews["reviews"].append(review_dict)

            product_dict["reviews"] = reviews

            await page.close()
            yield product_dict
