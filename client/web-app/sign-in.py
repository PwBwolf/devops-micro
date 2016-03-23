from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import time

driver = webdriver.Chrome()
driver.get("http://localhost:3000/sign-in")

driver.find_element_by_css_selector("*[id='email']").click()
driver.find_element_by_css_selector("*[id='email']").send_keys('carrickshawn+101@gmail.com')

driver.find_element_by_css_selector("*[id='password']").click()
driver.find_element_by_css_selector("*[id='password']").send_keys('Yiptv68!')

#time.sleep(5)
driver.find_element_by_class_name("submit-button").click()