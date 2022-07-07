import json 
import os
import pysftp
import sys
import csv
import paramiko
import pymongo   
import datetime
import sys
from datetime import datetime
import time
def RecordUploadFile(username, filename, filepath, counter):
    header=['file_path','file_name','username','last_download','last_created','download_count']
    dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    file_dir = os.path.join(dir_path,"file_record.csv")
    if(os.path.isfile(file_dir)):
        if counter==0:
            with open(file_dir, 'a',encoding="utf8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
                out_file.close()
        elif counter==1:
            file = []
            with open(file_dir, "r", newline='', encoding="UTF-8") as csvfile:
                csvReader = csv.DictReader(csvfile) 
                for row in csvReader:
                   #add this python dict to json array
                   file.append(row)
            os.remove(file_dir)
            download_count=0
            with open(file_dir, 'w+',encoding="utf8") as out_file:
                writer = csv.writer(out_file)
                writer.writerow(header)
                for record in file:
                    if str(record['file_name'])!=str(filename):
                        writer.writerow([record['file_path'],record['file_name'],record['username'],record['last_download'],record['last_created'],record['download_count']])
                        print(record)
                    else:
                        download_count=int(record['download_count'])
                writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), download_count])
                
    else:
        with open(file_dir, 'w+',encoding="utf8") as out_file:
            writer = csv.writer(out_file)
            writer.writerow(header)
            writer.writerow([filepath,filename,username,'',datetime.date(datetime.now()), 0])
            out_file.close()