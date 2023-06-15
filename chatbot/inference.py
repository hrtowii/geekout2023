import openai


api_key = "cant see"
openai.api_key = api_key

response = openai.Completion.create(
  engine="text-davinci-003",  # Use "text-davinci-003" for ChatGPT
  prompt="What is 1+1",
  max_tokens=50
)

answer = response.choices[0].text.strip()
print("Answer:", answer)