from flask import Flask
from flask import request, make_response, jsonify
from blueprint_auth import auth
from flask_mysqldb import MySQL
import json
import jwt

app =Flask(__name__)
app.register_blueprint(auth, url_prefix = "/auth")

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Kushal#025'
app.config['MYSQL_DB'] = 'time_app'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)


def checkProject(uid,project_name):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT COUNT(pid) FROM projects WHERE uid = %s AND project = %s """,(uid,project_name)
    )
    project_count = cursor.fetchone()['COUNT(pid)']
    cursor.close()
    return {"project_count": project_count}

def checkTask(uid,task_name):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT COUNT(tid) FROM tasks WHERE uid = %s AND task = %s """,(uid,task_name)
    )
    task_count = cursor.fetchone()['COUNT(tid)']
    cursor.close()
    return {"task_count": task_count}

@app.route('/addproject', methods = ['POST'])
def newProject():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    project = request.json['project_name']
    details = request.json['project_details']
    check = checkProject(val,project)
    cursor = mysql.connection.cursor()
    try:
        if check['project_count'] >= 1:
            return {"message": "Project Name Already exist"}
        else:
            cursor.execute(
                """INSERT INTO projects(project,details,uid) VALUES(%s, %s, %s) """, (project,details,val)
            )
            mysql.connection.commit()
            return {"message": "New Project Added"}
    except Exception as e:
        print(e)
    finally:
        cursor.close()


@app.route('/addtask', methods = ['POST'])
def newTask():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    task = request.json['task']
    startTime = request.json['startTime']
    endTime = request.json['endTime']
    pid = request.json['pid']
    check = checkTask(val,task)
    cursor = mysql.connection.cursor()
    try:
        if check['task_count'] >= 1:
            return {"message": "Task Name Already exist"}
        else:
            cursor.execute(
                """INSERT INTO tasks(task,startTime,endTime,pid,uid) VALUES(%s, %s, %s,%s,%s) """, (task,startTime,endTime,pid,val)
            )
            mysql.connection.commit()
            return {"message": "New Task Added"}
    except Exception as e:
        print(e)
    finally:
        cursor.close()


@app.route('/projectover', methods = ['POST'])
def completeProject():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    pid = request.json['pid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
                """UPDATE projects SET iscompeleted = 1  WHERE pid = %s AND uid = %s""", (pid,val)
            )
        mysql.connection.commit()
        return {"message": "Done"}
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.route('/taskover', methods = ['POST'])
def completeTask():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    tid = request.json['tid']
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
                """UPDATE tasks SET iscompeleted = 1  WHERE tid = %s AND uid = %s""", (tid,val)
            )
        mysql.connection.commit()
        return {"message": "Task Completed"}
    except Exception as e:
        print(e)
    finally:
        cursor.close()


@app.route('/getproject', methods = ['POST'])
def fetchProject():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT * FROM projects WHERE uid = %s AND iscompleted = 0""", (val)
        )
        results = cursor.fetchall()
        cursor.close()
        items = []
        for i in results:
            items.append(i)
        return {"projects":items}
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.route('/getuncompletedtask', methods = ['POST'])
def fetchuncompletedtask():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT * FROM tasks WHERE uid = %s AND iscompleted = 0""", (val)
        )
        results = cursor.fetchall()
        cursor.close()
        items = []
        for i in results:
            items.append(i)
        return {"tasks":items}
    except Exception as e:
        print(e)
    finally:
        cursor.close()

@app.route('/taskall', methods = ['POST'])
def allTask():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secure', algorithms=['HS256'])
    val = str(decode_data['user_id'])
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            """SELECT tasks.tid,tasks.task,tasks.startTime,tasks.endTime,tasks.iscompleted,projects.project FROM tasks join projects on tasks.pid = projects.pid WHERE tasks.uid = %s""", (val)
        )
        results = cursor.fetchall()
        cursor.close()
        items = []
        for i in results:
            items.append(i)
        return {"tasks":items}
    except Exception as e:
        print(e)
    finally:
        cursor.close()
        