# install
  pip install virtualenv
  python -m venv venv
  source venv/bin/activate
    deactivate
  pip install scrapy
  pip install scrapy-playwright
  playwright install
  pip install scrapeops-scrapy-proxy-sdk
  pip install pymongo
  pip install ipython
  <!-- pip install scrapy-rotating-proxies -->

# cmd
  scrapy
    startproject <project>
    scrapy genspider <spider> <website-(no-protocol)>
    scrapy crawl <spider>
      -O <file>.<json|csv>
    shell
      fetch('<url>')
      response.
        css()
