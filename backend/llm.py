
# prompt = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful meeting summarizer and analyst agent which will be recieving transcripts of meetings and will be expected to summarize and analyze the meetings, also answering questions about the meetings, and setting up action items based on the meetings."),
#     ("human", "{input}"),
# ])

# chain = prompt | llm


# Chat history enabled

# prompt = ChatPromptTemplate.from_messages([
#     ("system", "You are a helpful assistant that answer the questions. Also, you will be provided with chat history of the conversation so far. Use them when needed only."),
#     MessagesPlaceholder(variable_name="chat_history"),
#     ("human", "{input}"),
# ])

# chain = prompt | llm

# Add the ability to store and recall chat history of the last 6 messages in call_chain function
# def call_chain(query: str, chat_history: list[tuple[str, str]]) -> str:
#   # convert tuple history into list[BaseMessage] expected by MessagesPlaceholder
#   messages = []
#   for user_msg, assistant_msg in chat_history:
#     messages.append(HumanMessage(content=user_msg))
#     messages.append(AIMessage(content=assistant_msg))

#   response = chain.invoke({"input": query, "chat_history": messages})
#   chat_history.append((query, response.content))
#   if len(chat_history) > 6:
#     chat_history.pop(0)
#   return response

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import AIMessage, HumanMessage
from schemas.index import MeetingSummary
from langchain.output_parsers import PydanticOutputParser

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

llm = ChatGroq(api_key = GROQ_API_KEY, model = 'llama-3.3-70b-versatile').with_structured_output(MeetingSummary)
parser = PydanticOutputParser(pydantic_object = MeetingSummary)
format_instructions = parser.get_format_instructions()

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful meeting summarizer and analyst agent. Your task is to analyze meeting transcripts. Based on the transcript, five it a title, provide a concise summary, a list of action items, and the key points discussed. Also, mention all the participants in the meeting using transcript. Please format your response as a JSON object that strictly follows this schema:\n\n{format_instructions}"),
    ("human", "{input}"),
]).partial(format_instructions=format_instructions)

chain = prompt | llm

def call_chain(query: str) -> MeetingSummary:
  response = chain.invoke({"input": query})
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
