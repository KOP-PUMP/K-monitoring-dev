# K-Monitoring

## Installation

### Backend Installation

1. Install Python - [Window](https://www.python.org/downloads/windows/) - [MacOS](https://www.python.org/downloads/macos/)

#### Set up MySQL database

2. [Install MySQL Shell](https://dev.mysql.com/downloads/shell/)
3. [Download DBEngin](https://dbngin.com/)
   - After install DBEngin, Click **+** sign on top left corner to create new **MySQL** instance.
   - In this popup window set it up like this (values are depend on .env file)
   - Then click **Start**, wait until DBEngin download all important files.
4. Create database

Run these command (it will ask for password and saving, just click enter to continue)

```bash
mysqlsh -u root -h localhost --port 3306
# Please provide the password for 'root@localhost:3306':
# Save password for 'root@localhost:3306'? [Y]es/[N]o/Ne[v]er (default No):
```

#### Setup Django

5. Create virtual environment

```bash
cd backend
python -m venv venv
```

Then, enter virtual environment

```bash
# For Window
.\venv\Scripts\activate
# For MacOS
source venv/bin/activate
```

6. Install requirement

```bash
pip install -r requirements.txt
```

7. Create `.env`

Copy content of file `sample.env` into `.env`

8. Start Django Server

```bash
python manage.py migrate
python manage.py runserver --insecure
```

9. Create dummy admin

Run the following command

```bash
python manage.py shell
```

After enter shell, copy and paste these commands in shell (lines with this symbol: **>>>**)

```shell
from users.models import CustomUser
CustomUser.objects.create_superuser(email="admin1@gmail.com", username="admin1", password="@Password123")
quit()
```

### Frontend Installation

1. [Install NodeJS](https://nodejs.org/en/download/package-manager)
2. [Install PNPM](https://pnpm.io/installation)

```bash
npm install -g pnpm
```

Note: Normally, we can run the command above, if error occur follow PNPM installation guide in website

3. Create `.env.local`

Copy content of file `sample.env.local` into `.env.local`

4. Install modules and start react

```bash
cd frontend
pnpm install
pnpm run dev
```

5. Enter website

Go to [http://localhost:5173/](http://localhost:5173/)
or the link appear in terminal.

And login with this user

email="admin1@gmail.com"
password="@Password123"

---

## Project Structure

Note: Not include all directories or files but include all important files

```bash
frontend/
├─ public/
├─ src/
│  ├─ api/  # API request services
│  ├─ components/  # Components used in react
│  │  ├─ ui/  # Shadcn components
│  ├─ lib/  # Settings and Authentication related files
│  ├─ routes/  # All routes files to render each route, file-base routing
│  ├─ types/  # Typescript Interface, provide types to whole apps
│  ├─ validators/  # All zod types validator
│  ├─ App.jsx
│  ├─ index.css  # Config Shadcn theme here
│  ├─ main.jsx
├─ tsconfig.app.json  # Config typescript here
backend/
├─ core/
│  ├─ settings.py  # Config Django here
│  ├─ api.py  # collect api from whole django apps
├─ pumps/
│  ├─ schemas/  # Pydantic files
│  ├─ api.py  # Pumps-related api
│  ├─ permissions.py  # Create permission of users here
├─ users/
│  ├─ schema.py  # Pydantic files
│  ├─ signals.py  # Control profile creation
│  ├─ api.py  # Users-related api
```
