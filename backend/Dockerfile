FROM python:3.11

RUN mkdir /app
WORKDIR /app

RUN apt update && \
    apt install -y postgresql-client iptables iproute2 wireguard

#COPY requirements.txt ./
#RUN pip install --no-cache-dir -r requirements.txt
COPY ./requirements.lock ./
RUN sed '/-e/d' requirements.lock > requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .