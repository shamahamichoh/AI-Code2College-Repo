from flask import Flask, render_template, request, jsonify, session
from flask_session import Session
import openai
import os

app = Flask(__name__)

# Session configuration
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

openai.api_key = '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'
app.secret_key = 'supersecretkey'


# Home route
@app.route('/')
def home():
    return render_template('index.html')
# knowledge page route
@app.route('/knowledge_page')
def knowledge_page():
    return render_template('knowledge_page.html')
# Chat route - handles the conversation with the LLM
@app.route('/chat', methods=['POST'])
def chat():
    # Check if the incoming JSON data has the expected fields
    data = request.json
    if not data or 'message' not in data or 'brainType' not in data:
        print("Error: Missing 'message' or 'brainType' in request JSON")  # Debug
        return jsonify({'error': "Missing 'message' or 'brainType' in request"}), 400
    user_message = request.json['message']
    brain_type = request.json['brainType']
    print("User message:", user_message)  # Debug
    print("Brain type:", brain_type)  # Debug

    if 'conversation' not in session:
        session['conversation'] = []

    session['conversation'].append({"role": "user", "content": user_message})
    system_message = f"The user is showing a picture of a {brain_type}. Respond accordingly."
    messages = [{
        "role": "system",
        "content": system_message
    }] + session['conversation']

    print("System message:", system_message)  # Debug
    print("Messages sent to OpenAI:", messages)  # Debug


    try:
        # Make a request to OpenAI API
        response = openai.chat.completions.create(model="gpt-3.5-turbo",
                                                  messages=messages)
        gpt_response = response['choices'][0]['message']['content']
        print("GPT response:", gpt_response) #debug

        session['conversation'].append({
            "role": "assistant",
            "content": gpt_response
        })

        return jsonify({'response': gpt_response})
    except Exception as e:
        print("OpenAI API error:", openai_error)
        return jsonify({'error': 'OpenAI API error: ' + str(openai_error)}), 500 #debg
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': 'Error sending message. Please try again.'}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
