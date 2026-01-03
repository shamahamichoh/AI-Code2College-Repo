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
topic_info = ""
try:
    with open('topic_prompts/medAI.txt', 'r') as file:
        topic_info = file.read()
except Exception as e:
    print(f"Failed to read topic descriptions: {e}")



# Home route
@app.route('/')
def home():
    return render_template('index.html')
# knowledge page route
@app.route('/knowledge_page')
def knowledge_page():
    return render_template('knowledge_page.html')

@app.route('/about_page')
def about_page():
    return render_template('about.html')
# Chat route - handles the conversation with the LLM
@app.route('/chat', methods=['POST'])

def chat():
    # Check if the incoming JSON data has the expected fields
    data = request.json
    brain_type_descriptions = {
    "meningioma": "Meningiomas are typically benign tumors arising from the meninges. They are often slow-growing and can cause symptoms based on their size and location.",
    "glioblastoma": "Glioblastomas are aggressive and malignant brain tumors that arise from glial cells.",
    # Add more types here...
    "unknown": "The brain type could not be classified. Please consult a medical professional for detailed diagnosis.",
    "glioma": "Gliomas can cause a range of symptoms, including headaches, seizures, nausea, vomiting, and vision problems. Other symptoms include personality changes, weakness, numbness, and speech difficulties. Symptoms can vary depending on the type and location of the tumor, as well as its size and how quickly it's growing. Some gliomas don't cause any symptoms. ",
    "pituitary": "The symptoms of a pituitary tumor depend on the type of tumor and where it's located in the pituitary gland. Pituitary tumors can be diagnosed with blood and urine tests, a CT scan, MRI, or biopsy. Treatments include surgery, radiation therapy, medicine, radiosurgery, or gamma knife treatment.",
}
    
    if not data or 'message' not in data or 'brainType' not in data:
        print("Error: Missing 'message' or 'brainType' in request JSON")  # Debug
        return jsonify({'error': "Missing 'message' or 'brainType' in request"}), 400

    user_message = request.json['message']
    brain_type = request.json['brainType']

    # getting description from the dictionary
    description = brain_type_descriptions.get(brain_type, "No specific information available for this brain type.")

    print("User message:", user_message)  # Debug
    print("Brain type:", brain_type)  # Debug

    if 'conversation' not in session:
        session['conversation'] = []

    session['conversation'].append({"role": "user", "content": user_message})
    brain_type = request.json['brainType']
    
    system_message = f"The user is showing a picture of a brain classified as {brain_type}: {description}. Act as if you can see the image and give info on the tumor type.  Here is some additional information and context: + {topic_info}"




    messages = [{
        "role": "system",
        "content": system_message
    }] + session['conversation']

    print("System message:", system_message)  # Debug
    print("Messages sent to OpenAI:", messages)  # Debug


    try:
        # Make a request to OpenAI API
        response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)


        gpt_response = response.choices[0].message['content']
        print("GPT response:", gpt_response) #debug

        session['conversation'].append({
            "role": "assistant",
            "content": gpt_response
        })

        return jsonify({'response': gpt_response})
    except Exception as e:
        print("OpenAI API error:", str(e))
        return jsonify({'error': 'OpenAI API error: ' + str(e)}), 500 #debg
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': 'Error sending message. Please try again.'}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
