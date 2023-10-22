import scrapy
from playwright._impl._api_types import TimeoutError

import asyncio
import re
import markdownify
from random import uniform, randint


class OldBirdSpider(scrapy.Spider):
    name = "birds_manual"
    allowed_domains = ["allbirds.com"]
    start_url = "https://www.allbirds.com"

    custom_settings = {
        "FEEDS": {"allbirds-kids.json": {"format": "json", "overwrite": True}},
        "CONCURRENT_REQUESTS": 5,
        "DOWNLOAD_DELAY": 3,
        "CONCURRENT_REQUESTS_PER_IP": 5,
        # "AUTOTHROTTLE_ENABLED": True,
        # "AUTOTHROTTLE_START_DELAY": 5,
        # "AUTOTHROTTLE_MAX_DELAY": 20,
        # "AUTOTHROTTLE_TARGET_CONCURRENCY": 1.0,
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
                    collection=collection,
                ),
            )

        # direct product links
        # for start_url in self.start_urls:
        #     yield scrapy.Request(
        #         start_url,
        #         callback=self.parse_product,
        #         meta=dict(
        #             playwright=True,
        #             playwright_include_page=True,
        #             errback=self.errback,
        #             collection="mens",
        #         ),
        #     )

    async def parse_collection(self, response):
        page = response.meta["playwright_page"]

        collection = response.meta["collection"]

        urls_locator = page.locator(".Grid__item--CHILD_COLLECTION a")
        product_urls = []

        for i in range(await urls_locator.count()):
            url_locator = urls_locator.nth(i)
            product_url = await url_locator.get_attribute("href")
            product_urls.append(self.start_url + product_url)

        # print(product_urls)

        for product_url in product_urls:
            yield scrapy.Request(
                self.start_url + product_url,
                callback=self.parse_product,
                meta=dict(
                    playwright=True,
                    playwright_include_page=True,
                    errback=self.errback,
                    collection=collection,
                ),
            )

        await page.close()

    async def parse_product(self, response):
        page = response.meta["playwright_page"]
        collection = response.meta["collection"]

        try:
            popup = page.locator(".ReactModal__Content")
            await popup.wait_for(state="attached", timeout=10000)
            close_btn = popup.locator(".Modal__close--big button")
            await close_btn.click()
            await asyncio.sleep(uniform(0.5, 1))

        except TimeoutError:
            pass

        finally:
            # data
            ## title
            title_locator = page.locator("h1.PdpMasterProductDetails__heading")
            title = await title_locator.text_content()
            title.strip().lower()

            ## price
            price_locator = page.locator(
                ".PdpMasterProductDetails__price-section p:last-of-type"
            )
            price = await price_locator.text_content()
            price = float(price.replace("$", ""))

            ## free-shipping
            free_shipping = (
                response.css(".PdpFreeShippingIndicatorDesktop::text").get() is not None
            )

            ## sizes
            size_list = []
            sizes_locator = page.locator(".PdpSizeSelector__grid-item button")

            # collection
            for i in range(await sizes_locator.count()):
                size_locator = sizes_locator.nth(i)

                # if collection != "socks":
                try:
                    size = float(await size_locator.text_content())
                    size_list.append(size)

                except:
                    try:
                        size_letter_locator = size_locator.locator("span p").nth(0)
                        size_letter = await size_letter_locator.text_content()

                        size_value_locator = size_locator.locator("span p").nth(1)
                        size_value = await size_value_locator.text_content()

                        size_list.append({"letter": size_letter, "value": size_value})
                    except:
                        size = await size_locator.text_content()
                        size_list.append(size)

            ## colors
            on_sale = False
            color_dict = {}
            color_locators = page.locator(".PdpProductSelectorSection")

            for i in range(await color_locators.count()):
                color_locator = color_locators.nth(i)

                color_type_locator = color_locator.locator(".Overview__label")
                color_type = await color_type_locator.text_content()
                color_type = color_type.split(":")[0].strip().lower()

                color_dict[color_type] = []
                color_locator_buttons = color_locator.locator(".SwatchList button")

                for j in range(await color_locator_buttons.count()):
                    color_locator_button = color_locator_buttons.nth(j)
                    await color_locator_button.click()
                    await asyncio.sleep(uniform(1.5, 2))

                    color_name_locator = color_locator.locator(".Overview__name")
                    color_name = await color_name_locator.text_content()
                    color_name = color_name.strip().lower()

                    colors_str = await color_locator_button.locator(
                        ".ColorSwatch"
                    ).evaluate("(node) => window.getComputedStyle(node).background")

                    color_list = []

                    hex_matches = re.findall(r"#([0-9a-fA-F]{6})", colors_str)
                    color_list.extend(["#" + code for code in hex_matches])

                    rgb_matches = re.findall(
                        r"rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)", colors_str
                    )

                    for rgb_tuple in rgb_matches:
                        hex_code = "#%02x%02x%02x" % tuple(map(int, rgb_tuple))
                        color_list.append(hex_code)

                    ### images
                    images_list = []
                    images_locator = page.locator(".Grid__cell--medium-up-6 img")

                    for k in range(await images_locator.count()):
                        src_locator = images_locator.nth(k)
                        src = await src_locator.get_attribute("src")
                        images_list.append(src)

                    size_sold_out_list = []
                    size_buttons_locator = page.locator(
                        ".PdpSizeSelector__grid-item button"
                    )

                    for k in range(await size_buttons_locator.count()):
                        size_button_locator = size_buttons_locator.nth(k)
                        unavailable_size = await size_button_locator.get_attribute(
                            "class"
                        )

                        if "SizeButton--unavailable" in unavailable_size:
                            if collection != "socks":
                                size_sold_out_locator = size_button_locator.locator(
                                    ".SizeButton-text--size"
                                )
                                size_sold_out = float(
                                    await size_sold_out_locator.text_content()
                                )

                            else:
                                size_sold_out_locator = size_button_locator.locator(
                                    ".Sub--bold"
                                )
                                size_sold_out = (
                                    await size_sold_out_locator.text_content()
                                )

                            size_sold_out_list.append(size_sold_out)

                    color_itme = {
                        "name": color_name,
                        "hex": color_list,
                        "images": images_list,
                    }

                    if len(size_sold_out_list):
                        color_itme["size_sold_out"] = size_sold_out_list

                    if color_type == "sale":
                        on_sale = True
                        sale_price_locator = page.locator(
                            ".PdpMasterProductDetails__compare-at-price"
                        )

                        sale_price = await sale_price_locator.text_content()
                        color_itme["sale_price"] = float(sale_price.replace("$", ""))

                    color_dict[color_type].append(color_itme)

            ## highlights
            highlights_locator = page.locator(".PdpDifferentiators p")
            highlights_list = []

            for i in range(await highlights_locator.count()):
                highlight_locator = highlights_locator.nth(i)
                highlight = await highlight_locator.text_content()
                highlight = highlight.strip().lower()
                highlights_list.append(highlight)

            ## dropdowns
            dropdown_list = []
            dropdowns_locator = page.locator(".PdpAttributes__dropdown")

            for i in range(await dropdowns_locator.count()):
                dropdown_locator = dropdowns_locator.nth(i)

                dropdown_title_locator = dropdown_locator.locator(
                    ".typography--senary-heading"
                )
                dropdown_title = await dropdown_title_locator.text_content()

                dropdown_button_locator = dropdown_locator.locator(".Dropdown__header")
                await dropdown_button_locator.scroll_into_view_if_needed()
                await dropdown_button_locator.click()
                await asyncio.sleep(uniform(1, 2))

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

            ## recommendations
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
                reommendation_img_locator = reommendation_locator.locator("img")
                reommendation_img = await reommendation_img_locator.get_attribute("src")

                recommendations_list.append(
                    {"name": reommendation_text, "img": reommendation_img}
                )

            ## material_features
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

            ## reviews
            ### rating
            try:
                rating_locator = page.locator(".Rating__legend")
                rating = float(await rating_locator.text_content())

                ### rating_count
                rating_count_locator = page.locator(
                    ".PdpReviewsOverview__reviews-count"
                )
                rating_count = await rating_count_locator.text_content()
                rating_count = int(rating_count.split(" ")[0])

                reviews_dict = {"rating": rating, "rating_count": rating_count}

                review_pages = randint(2, 4)
                reviews_list = []

                for i in range(1, review_pages):
                    reviews_locator = page.locator(".PdpReviewsList__item")

                    for j in range(await reviews_locator.count()):
                        review_locator = reviews_locator.nth(j)

                        ### comment
                        stars_locator = review_locator.locator(".Icon--STAR_FULL")
                        stars = await stars_locator.count()

                        title_locator = review_locator.locator("h3")
                        review_title = await title_locator.text_content()
                        review_title = review_title.strip().lower()

                        text_locator = review_locator.locator("p span")
                        text = await text_locator.text_content()
                        text = text.strip().lower()

                        date_locator = review_locator.locator(".PdpReview__date")
                        date = await date_locator.text_content()
                        date = date.strip().lower()

                        ### details
                        details_locator = review_locator.locator(".PdpReview__details")

                        username_locator = details_locator.locator(
                            ".PdpReview__author-label"
                        )
                        username = await username_locator.text_content()
                        username = username.strip().lower()

                        verified_locator = details_locator.locator(
                            ".PdpReview__verified-buyer"
                        )
                        is_verified = True if verified_locator else False

                        attribute_dict = {}
                        attributes_locator = details_locator.locator(
                            ".PdpReview__attribute"
                        )

                        for j in range(await attributes_locator.count()):
                            attribute_locator = attributes_locator.nth(j)

                            attribute_key_locator = attribute_locator.locator(
                                "span:first-of-type"
                            )
                            attribute_title = await attribute_key_locator.text_content()
                            attribute_title = (
                                attribute_title.replace(":", "").strip().lower()
                            )

                            attribute_value_locator = attribute_locator.locator(
                                "span:last-of-type"
                            )
                            attribute_value = (
                                await attribute_value_locator.text_content()
                            )
                            attribute_value = attribute_title.strip().lower()

                            attribute_dict[attribute_title] = attribute_value

                        review_item = {
                            "review": {
                                "stars": stars,
                                "title": review_title,
                                "text": text,
                                "date": date,
                            },
                            "details": {
                                "username": username,
                                "verified": is_verified,
                            },
                        }
                        if attribute_dict:
                            review_item["details"]["attributes"] = attribute_dict
                        reviews_list.append(review_item)

                        next_btn_locator = page.locator(
                            ".PdpReviewsPageSelector a"
                        ).nth(i + 1)

                        # if await next_btn_locator.count() > 0:
                        await next_btn_locator.evaluate("(node) => node.click()")
                        await asyncio.sleep(uniform(3, 4))

                reviews_list_unique = list(
                    {obj["review"]["title"]: obj for obj in reviews_list}.values()
                )
                reviews_dict["comments"] = reviews_list_unique

            except:
                reviews_dict = {}

            page.close()

            yield {
                "collection": collection,
                "title": title,
                "price": price,
                "free_shipping": free_shipping,
                "on_sale": on_sale,
                "colors": color_dict,
                "sizes": size_list,
                "highlights": highlights_list,
                "dropdown": dropdown_list,
                "recommendations": recommendations_list,
                "material_features": material_features_list,
                "reviews": reviews_dict,
            }
