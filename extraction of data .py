from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import pandas as pd
import time


driver = webdriver.Firefox()




for i in range(1,7):

    driver.get('https://josaa.admissions.nic.in/applicant/SeatAllotmentResult/CurrentORCR.aspx')

    dropdown=driver.find_element(By.XPATH,"//body/form[@id='aspnetForm']/div[@class='container-fluid contentmid']/div[@class='contentmiddivChoice']/div[1]/..//span[contains(text(),'--Select--')]")

    dropdown.click()#round button click


    dropdown2=driver.find_element(By.XPATH,"//*[@id='ctl00_ContentPlaceHolder1_ddlroundno_chosen']/div/ul/li["+str(i+1)+"]")

    dropdown2.click()

    dropdown3=driver.find_element(By.XPATH,"//div[@id='ctl00_ContentPlaceHolder1_ddlInstype_chosen']//span[contains(text(),'--Select--')]/..//span[contains(text(),'--Select--')]")

    dropdown3.click()#institute click

    drop3=driver.find_element(By.XPATH,"//*[@id='ctl00_ContentPlaceHolder1_ddlInstype_chosen']/div/ul/li[2]")
    drop3.click()#institute select

    drop4=driver.find_element(By.XPATH,"//div[@class='container-fluid contentmid']//div[3]/..//span[normalize-space()='--Select--']")
    drop4.click()#name click

    dropdown4=driver.find_element(By.XPATH,"//*[@id='ctl00_ContentPlaceHolder1_ddlInstitute_chosen']/div/ul/li[2]")
    dropdown4.click()#name select

    drop5=driver.find_element(By.XPATH,"//body/form[@id='aspnetForm']/div[@class='container-fluid contentmid']/div[@class='contentmiddivChoice']/div[4]/div[1]/..//a[@class='chosen-single']")
    drop5.click()#academic prog click

    dropdown5=driver.find_element(By.XPATH,"//*[@id='ctl00_ContentPlaceHolder1_ddlBranch_chosen']/div/ul/li[2]")
    dropdown5.click()#academic prog select

    drop6=driver.find_element(By.XPATH,"//div[@id='ctl00_ContentPlaceHolder1_ddlSeattype_chosen']//a[@class='chosen-single']/..//a[@class='chosen-single']")
    drop6.click()#cat click

    dropdown6=driver.find_element(By.XPATH,"//*[@id='ctl00_ContentPlaceHolder1_ddlSeattype_chosen']/div/ul/li[2]")
    dropdown6.click()#cat select

    time.sleep(2)


    #submit button click:
    submit=driver.find_element(By.XPATH,"//div[@class='col-sm-12 text-center']/..//input[@id='ctl00_ContentPlaceHolder1_btnSubmit']")
    submit.click()

    pages = driver.page_source
    bc = BeautifulSoup(pages, 'lxml')

    table = bc.find('table', id='ctl00_ContentPlaceHolder1_GridView1')

    if table:
        data = []
        table_rows = table.find_all('tr')
        for tr in table_rows:
            td = tr.find_all('td')
            row = [tr.text for tr in td]
            data.append(row)
        df = pd.DataFrame(data)
        df.to_excel('2023 Round '+str(i)+'.xlsx', index=False, header=False)
    else:
        print("Data element not found")

    time.sleep(5)