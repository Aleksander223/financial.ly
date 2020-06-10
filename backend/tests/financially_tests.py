#!/usr/bin/python3
import requests
import json
import random
import string  # used for random passwords and random users
from termcolor import colored  # used for colored prints
"""
All future tests should be only functions that start with "test"
"""


def random_generator(length=10):  # random string
    return ''.join(random.choice(string.ascii_letters) for i in
                   range(length))


URL_frontend = "http://localhost:9999"
URL_backend = "http://localhost:3333"
correct_email = random_generator(4) + "@test.test"  # suppose this is valid
correct_password = "test"
correct_auth_cookie = None
not_ok = 0


def test_login_with_wrong_credentials(wrong_email=random_generator(),
                                      wrong_password=random_generator(),
                                      expected_status=400):
    payload = {"Origin": URL_frontend, "Content-Type": "application/json"}
    response = requests.post(URL_backend + "/user/login/", headers=payload,
                             data='{"email":"' + wrong_email + '","password":"\
' + wrong_password + '"}')
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}\
              ".format(payload, response.status_code, response.text))
    return expected_status == response.status_code


def test_register_with_correct_credentials(correct_email=correct_email,
                                           correct_password=correct_password,
                                           expected_status=201):
    data = {'username': random_generator(),
            'email': correct_email,
            'password': correct_password,
            'telephone': random_generator(),
            'country': random_generator(),
            'city': random_generator(),
            'zip': random_generator(),
            'street': random_generator()}
    data = json.dumps(data, separators=(',', ':'))

    payload = {"Origin": URL_frontend, "Content-Type": "application/json"}
    response = requests.post(URL_backend + "/user/register/", headers=payload,
                             data=data)
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}\
              ".format(payload, response.status_code, response.text))
    return expected_status == response.status_code


def test_register_with_the_same_email(expected_status=400):
    data = {'username': random_generator(),
            'email': correct_email,
            'password': correct_password,
            'telephone': random_generator(),
            'country': random_generator(),
            'city': random_generator(),
            'zip': random_generator(),
            'street': random_generator()}
    data = json.dumps(data, separators=(',', ':'))

    payload = {"Origin": URL_frontend, "Content-Type": "application/json"}
    response = requests.post(URL_backend + "/user/register/", headers=payload,
                             data=data)
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}\
              ".format(payload, response.status_code, response.text))
    return expected_status == response.status_code


def test_login_with_correct_credentials(expected_status=201):
    global correct_auth_cookie
    payload = {"Origin": URL_frontend, "Content-Type": "application/json"}
    session = requests.session()
    response = session.post(URL_backend + "/user/login/", headers=payload,
                            data='{"email":"' + correct_email + '\
","password":"' + correct_password + '"}')
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}\
              ".format(payload, response.status_code, response.text))
    correct_auth_cookie = {"Authorization": "Bearer \
" + response.text.split('token":"')[1][:-2]}
    return expected_status == response.status_code


def test_status_with_correct_credentials(expected_status=200):
    cookies = correct_auth_cookie
    response = requests.get(URL_backend + "/user/status/", cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code


def test_status_with_wrong_credentials(expected_status=404):
    cookies = {"Authorization": "Bearer " + random_generator(100)}
    response = requests.get(URL_backend + "/user/status/", cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code


def test_transaction_all_with_correct_credentials(expected_status=200):
    cookies = correct_auth_cookie
    response = requests.get(URL_backend + "/transaction/all/", cookies=cookies)
    response_status = json.loads(response.text)['status']
    if expected_status != response_status:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response_status, response.text))
    return expected_status == response_status


def test_transaction_all_with_wrong_credentials(expected_status=404):
    cookies = {"Authorization": "Bearer " + random_generator(100)}
    response = requests.get(URL_backend + "/transaction/all/", cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code


def test_transaction_list_with_correct_credentials(expected_status=200):
    cookies = correct_auth_cookie
    response = requests.get(URL_backend + "/transaction/list/",
                            cookies=cookies)
    response_status = json.loads(response.text)['status']
    if expected_status != response_status:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response_status, response.text))
    return expected_status == response_status


def test_transaction_list_with_wrong_credentials(expected_status=404):
    cookies = {"Authorization": "Bearer " + random_generator(100)}
    response = requests.get(URL_backend + "/transaction/list/",
                            cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code


def test_transaction_currencies_with_correct_credentials(expected_status=200):
    cookies = correct_auth_cookie
    response = requests.get(URL_backend + "/transaction/currencies/",
                            cookies=cookies)
    response_status = json.loads(response.text)['status']
    if expected_status != response_status:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response_status, response.text))
    return expected_status == response_status


def test_transaction_currencies_with_wrong_credentials(expected_status=404):
    cookies = {"Authorization": "Bearer " + random_generator(100)}
    response = requests.get(URL_backend + "/transaction/currencies/",
                            cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code


def test_transaction_create_with_wrong_credentials(expected_status=404):
    cookies = {"Authorization": "Bearer " + random_generator(100)}
    response = requests.post(URL_backend + "/transaction/create/",
                             cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code


def test_transaction_cancel_with_wrong_credentials(expected_status=404):
    cookies = {"Authorization": "Bearer " + random_generator(100)}
    response = requests.post(URL_backend + "/transaction/cancel/",
                             cookies=cookies)
    if expected_status != response.status_code:
        print("cookies: {} ,status code: {} & response: {}\
              ".format(cookies, response.status_code, response.text))
    return expected_status == response.status_code

# Not implemented yet
# def test_transaction_cancel_with_correct_credentials(expected_status=200):
#     cookies = correct_auth_cookie
#     response = requests.post(URL_backend + "/transaction/cancel/",
#                              cookies=cookies)
#     response_status = json.loads(response.text)['status']
#     if expected_status != response_status:
#         print("cookies: {} ,status code: {} & response: {}\
#               ".format(cookies, response_status, response.text))
#     return expected_status == response_status


# def test_transaction_create_with_correct_credentials(expected_status=200):
#     cookies = correct_auth_cookie
#     response = requests.post(URL_backend + "/transaction/create/",
#                              cookies=cookies)
#     response_status = json.loads(response.text)['status']
#     if expected_status != response_status:
#         print("cookies: {} ,status code: {} & response: {}\
#               ".format(cookies, response_status, response.text))
#     return expected_status == response_status


for key, value in list(locals().items()):
    if callable(value):
        if key.startswith("test"):
            key = key.replace("test_", "").replace("_", " ")
            try:
                if value():
                    print(colored(key, 'blue'))
                else:
                    print(colored(key, 'red'))
                    not_ok += 1
            except Exception as e:
                print(colored(key, 'red'))
                print(colored("ERROR: " + str(e), 'red'))
                not_ok += 1
                continue

if not_ok == 0:
    print(colored('Tests successfull passed', 'green'))
else:
    print(colored('{} test(s) failed'.format(not_ok), 'red'))
exit(0)
