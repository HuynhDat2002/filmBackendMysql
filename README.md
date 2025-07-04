# Interfaces
    Homepage Screenshot
![Homepage Screenshot](./images/homepage.png)

    Filter Screenshot
![Filter Screenshot](./images/filter.png)

    Search Screenshot
![Search Screenshot](./images/search.png)

    Login Screenshot
![Login Screenshot](./images/login.png)

    Movie Screenshot
![Movie Screenshot](./images/movie.png)


# How to run the project (Install docker first)

👉 **Step 1: Pull images from Docker Hub**
```bash
docker compose -f docker-compose.prod.yml pull
```

👉 **Step 2: Run the project up**
```bash
docker compose -f docker-compose.prod.yml up
```

👉 **Step 3: Access project via browser**
```bash
http://localhost:8080/
```

**Clean dangling images**
```bash
docker image prune
```

