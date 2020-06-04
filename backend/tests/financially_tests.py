#!/bin/env python3
import requests
import json
import random
import string
from termcolor import colored


URL_frontend = "http://localhost:3333"
URL_backend = "http://localhost:9999"

def random_generator(length=10):

    return ''.join(random.choice(string.ascii_lowercase) for i in range(length))

correct_email = random_generator(4) + "@test.test"
correct_password = "test"
not_ok = 0

def test_login_with_wrong_credentials(wrong_email=random_generator(), wrong_password=random_generator(), expected_status=400):
    payload = {"Origin": URL_backend, "Content-Type": "application/json"}
    response = requests.post(URL_frontend + "/user/login/", headers=payload,
               data='{"email":"' + wrong_email+ '","password":"'
                                 + wrong_password+ '"}')
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}".format(payload,response.status_code,response.text))
    return expected_status == response.status_code

def test_register_with_correct_credentials(correct_email=correct_email, correct_password=correct_password, expected_status=201):
    data = {'username':random_generator(),
            'email':correct_email,
            'password':correct_password,
            'telephone':random_generator(),
            'country':random_generator(),
            'city':random_generator(),
            'zip':random_generator(),
            'street':random_generator()}
    data = json.dumps(data, separators=(',', ':'))

    payload = {"Origin": URL_backend, "Content-Type": "application/json"}
    response = requests.post(URL_frontend + "/user/register/", headers=payload,
               data=data)
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}".format(payload,response.status_code,response.text))
    return expected_status == response.status_code

def test_register_with_the_same_email(correct_email=correct_email, correct_password=correct_password, expected_status=400):
    data = {'username':random_generator(),
            'email':correct_email,
            'password':correct_password,
            'telephone':random_generator(),
            'country':random_generator(),
            'city':random_generator(),
            'zip':random_generator(),
            'street':random_generator()}
    data = json.dumps(data, separators=(',', ':'))

    payload = {"Origin": URL_backend, "Content-Type": "application/json"}
    response = requests.post(URL_frontend + "/user/register/", headers=payload,
               data=data)
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}".format(payload,response.status_code,response.text))
    return expected_status == response.status_code

def test_login_with_correct_credentials(correct_email=correct_email, correct_password=correct_password, expected_status=201):
    payload = {"Origin": URL_backend, "Content-Type": "application/json"}
    response = requests.post(URL_frontend + "/user/login/", headers=payload,
               data='{"email":"' + correct_email+ '","password":"'
                                 + correct_password+ '"}')
    if expected_status != response.status_code:
        print("payload: {} ,status code: {} & response: {}".format(payload,response.status_code,response.text))
    return expected_status == response.status_code


for key, value in list(locals().items()):
    if callable(value):
        if key.startswith("test"):
            if value():
                print(colored(key,'blue'))
            else:
                print(colored(key,'red'))
                not_ok += 1

if not_ok == 0:
    print(colored('Tests successfull passed','green'))
else:
    print(colored('{} test(s) failed'.format(not_ok),'red'))
