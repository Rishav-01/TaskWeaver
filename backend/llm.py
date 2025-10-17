import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from schemas.index import MeetingSummary
from langchain.output_parsers import PydanticOutputParser

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(api_key = GROQ_API_KEY, model = 'llama-3.3-70b-versatile').with_structured_output(MeetingSummary)
parser = PydanticOutputParser(pydantic_object = MeetingSummary)
format_instructions = parser.get_format_instructions()
prompt_message = f"You are a helpful meeting summarizer and analyst agent. Your task is to analyze meeting transcripts. Based on the transcript, give it a title, provide a brif summary, a list of action items according to their prority and their assignment to which participant, also the action items should have priority as high, medium and low, the status of action items include -> pending, in-progress, completed and the key points discussed. Also, mention all the participants in the meeting along with the total time elapsed in minutes (Eg -> 120, 70) and also give start time and end time of the meeting using transcript. Please format your response as a JSON object that strictly follows this schema:\n\n {format_instructions}\n\n"

prompt = ChatPromptTemplate.from_messages([
    ("system", "{prompt_message}"),
    ("human", "{input}"),
])

chain = prompt | llm

def call_chain(query: str) -> MeetingSummary:
  response = chain.invoke({"input": query, "prompt_message": prompt_message})
  return response

if __name__ == "__main__":
  test_query = """
  Here is the transcript of a meeting:
  Alice: Hi everyone, thanks for joining the meeting. Let's discuss the project updates.
  Bob: Sure, I have completed the initial design phase and will be starting development next week.
  Charlie: I've been working on the marketing strategy and will share a draft by Friday.
  Alice: Great to hear! Let's set up a follow-up meeting next week to review progress.
  """
  result = call_chain(test_query)
  print("Summary:", result.summary)
  print("Action Items:", result.action_items)
  print("Key Points:", result.key_points)
  print("\nRaw Pydantic object:")
  print(result)
