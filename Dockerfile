FROM google/nodejs

EXPOSE 3000

# Copy application code.
    COPY . /app/

    # Install dependencies.
    RUN npm --unsafe-perm install
