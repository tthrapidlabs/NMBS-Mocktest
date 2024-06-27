from flask import Flask, render_template, request, send_file , json , jsonify
import PyPDF2      
import openai  
import re  
from PyPDF2 import PdfReader 
from flask import Flask,jsonify,request, session, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from sqlalchemy import func
from multiprocessing import Pool, cpu_count 
from datetime import datetime, timedelta
from fuzzywuzzy import fuzz
import openai
import requests
import re
import json
from os.path import splitext, exists
import nltk
from datetime import datetime
# nltk.download('punkt')
from nltk.tokenize import word_tokenize
# import jwt
from functools import wraps
import nltk
from nltk.corpus import stopwords
import PyPDF2
import signal
import os
import uuid
import time
from datetime import datetime
import pandas as pd  
import sqlite3  
import openai  
import pandas as pd  
import sqlite3  
import openai 
   
import pandas as pd           
from flask import Response  
from flask_cors import CORS
app = Flask(__name__) 
CORS(app)
    
app = Flask(__name__)
app.secret_key = "it's a chatbot"
app.permanent_session_lifetime = timedelta(minutes=30)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///src/database/db1.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "TEST"

CORS(app, supports_credentials=True)
db = SQLAlchemy(app)

@app.route("/")
def hello():
    """
        return hello World
    """
    return "Hello! ."


@app.route('/api/getQuestions', methods = ['POST'])
def getques():
    print("test")
    data = request.get_json()
    level = data.get('level')
    print(level)
    openai.api_type = "azure"
    openai.api_version = "2023-05-15"
    openai.api_base = "https://ourusecases.openai.azure.com/"  
    openai.api_key = "3a6224fc550a41beba3167f9b3c2d08e"
    # if request.method == 'GET':
    
    #   file_path = f"src/files/conversation + memory.txt"
    #   if os.path.isfile(file_path):
    #       os.remove(file_path)
    #       print("file deleted.")
    #   else:
    #       print("File Not Found.")
    
    reader = PdfReader('HLT compilé FR 10-12-2023 (V20-12-2023).pdf') 

    # print(len(reader.pages)) 

    page = reader.pages[0] 

    text = page.extract_text() 

    Example_Response = '''[
    {
      "id": 1,
      "question": "What is the capital of Japan?",
      "options": ["Seoul", "Beijing", "Tokyo", "Bangkok"]
    },
    {
      "id": 2,
      "question": "What is the capital of Japan?",
      "options": ["Seoul", "Beijing", "Tokyo", "Bangkok"]
    }
  ]'''
    with open(f"src/files/conversation + question_answer.txt", "r") as file:  
        conversational_history = file.read()
    
    messages = [{"role": "system", "content": f'''Based on input need to generate 5 questions, there options like multiple choices it is in 2 sentences or 3 sentences that option it is ok, everything is like in this format. i.e.  particular json format {Example_Response}.Like the json response only i need. meaning in double quotes.Based on the input lanuage only i need the the generated output.Here it is in french. so i need the response in french itself.'''},        
            {"role": "user", "content": f'''{text} is the input, that is a content from pdf.
            {level} is the difficulty level.Based on the difficulty level You need to generate the multiple choice questions.dont repeat the questions again.'''}]
    response = openai.ChatCompletion.create(        
            engine="gpt32",        
            messages=messages,        
            temperature=.1,        
            max_tokens=3000,        
            top_p=1,        
            frequency_penalty=0,        
            presence_penalty=0        
        )        
        

    data2 = response['choices'][0]['message']['content'] 
    answer = json.loads(data2)
    # print(data2)

    _ = {'status' : 'SUCCESS', 'response' :answer}
    return _


@app.route('/api/postSelectedAnswer', methods = ['POST'])
def getanswer():
    
    openai.api_type = "azure"
    openai.api_version = "2023-05-15"
    openai.api_base = "https://ourusecases1.openai.azure.com/"  
    openai.api_key = "deab24a2ee2940b7b0abaf98262b0c69"

    data = request.get_json()
    print(data)
    reader = PdfReader('HLT compilé FR 10-12-2023 (V20-12-2023).pdf') 

    print(len(reader.pages)) 

    page = reader.pages[0] 

    text = page.extract_text() 


    Example_Response = '''{
  "correctAnswer": "Tokyo",
  "description": "The answer you chose is wrong. The capital of Japan is Tokyo, not Seoul. Seoul is the capital of South Korea."        
}'''

    messages = [{"role": "system", "content": f'''{text} is the content from pdf. Based on the pdf content i need the correct answer and the description. Meaning choose the correct answer from the multiple choice question by analysing the pdf content. and give the description stating that why the answer is correct or wrong and the reason for that. For example like {Example_Response}. I need the response in json format itself, i.e in double quotes. Based on the input lanuage only i need the the generated output.Here it is in french. so i need the response in french itself.'''},        
            {"role": "user", "content": f'''{data} is the input question,multiple choice  option and the user response.'''}]

    response = openai.ChatCompletion.create(        
            engine="gpt32",        
            messages=messages,        
            temperature=.1,        
            max_tokens=2000,        
            top_p=1,        
            frequency_penalty=0,        
            presence_penalty=0        
        )        
        

    answer = response['choices'][0]['message']['content'] 
    print(answer)

    _ = {'status' : 'SUCCESS', 'response' :answer}
    return _


@app.route('/api/chatBot', methods = ['POST'])
def getchatbot():
    openai.api_type = "azure"
    openai.api_version = "2023-05-15"
    openai.api_base = "https://ourusecases.openai.azure.com/"  
    openai.api_key = "3a6224fc550a41beba3167f9b3c2d08e"

    data = request.get_json()
    print(data)
    question = data.get('question')
    reader = PdfReader('HLT compilé FR 10-12-2023 (V20-12-2023).pdf') 

    print(len(reader.pages)) 

    page = reader.pages[0] 

    text = page.extract_text() 

    with open(f"src/files/conversation + memory.txt", "a") as file:  
            file.write(f"User: {question}\n")
            
    with open(f"src/files/conversation + question_answer.txt", "a") as file:  
            file.write(f"User: {question}\n")
        
    def count_occurrences(word, file_name):  
        with open(file_name, 'r') as file:  
            text = file.read()  
        words = text.split()  
        return words.count(word)
    
    file_name = f"src/files/conversation + memory.txt"
    file_name1 = f"src/files/conversation + question_answer.txt"
    
    Word = "User:"
    print(count_occurrences(Word, file_name))
    if count_occurrences(Word, file_name) == 10:
        os.remove(file_name) 
        
    Word = "User:"
    print(count_occurrences(Word, file_name1))
    if count_occurrences(Word, file_name1) == 10:
        os.remove(file_name1) 
    
    
    
    with open(f"src/files/conversation + memory.txt", "r") as file:  
        conversational_history = file.read()
    

    messages = [{"role": "system", "content": f'''{text} is the content from pdf. Based on the pdf content i need the the answer from the pdf content. I need a heading for that meaning in the sense, if i aak any question i need a heading surrounded by *. for example *carry on baggage* like this. then after a space show the answers in 3 points. Then afetr the space show that Source:Voitures I10. I need the response must be in the language of the input question. If the question in english answer in english itself. If it is in French answer in french itself.{conversational_history} is the previous chat history of the user and ai. so based on that need to answer.While answering dont specify that AI in answers.While showing the answer show the points starting with hyphen. Not need numbers. If the question is in english answer in english, if the question is there in french answer in french itself. '''},        
            {"role": "user", "content": f'''{question} is the input question.'''}]

    response = openai.ChatCompletion.create(        
            engine="gpt32",        
            messages=messages,        
            temperature=.1,        
            max_tokens=2000,        
            top_p=1,        
            frequency_penalty=0,        
            presence_penalty=0        
        )        
        

    answer = response['choices'][0]['message']['content']
    with open(f"src/files/conversation + memory.txt", "a") as file:  
            file.write(f"AI: {answer}\n") 
    with open(f"src/files/conversation + question_answer.txt", "a") as file:  
            file.write(f"AI: {answer}\n")  
    print(answer)
    
    return{'message' : 'DATA INSERTED', 'status' : 'SUCCESS','data' : {'q' : data.get('question'), 'a' : answer, 'created_at' : datetime.now(), 'answer':answer}}
    return _



# if __name__ == '__main__':
#     app.run(debug=True)

