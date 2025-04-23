FROM node:18

# Install Python + pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Set working directory
WORKDIR /app

# Install Node.js dependencies
COPY package*.json ./
RUN npm install

# Install Python packages with break-system-packages flag
COPY requirements.txt .
RUN pip3 install --break-system-packages -r requirements.txt

# Copy rest of the application (including chatbot.py)
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
