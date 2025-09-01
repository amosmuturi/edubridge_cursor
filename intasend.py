# intasend.py

class APIService:
    def __init__(self, publishable_key, secret_key, api_url):
        self.publishable_key = publishable_key
        self.secret_key = secret_key
        self.api_url = api_url

    def make_payment(self, *args, **kwargs):
        # implement payment logic here
        pass
