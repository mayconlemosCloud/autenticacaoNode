# Define a imagem base
FROM node:latest

# Define a pasta de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Define o comando de inicialização
CMD ["npm", "start"]
