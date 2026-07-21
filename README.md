# K-Monitoring

## Installation

### Backend Installation

1. Install Python - [Window](https://www.python.org/downloads/windows/) - [MacOS](https://www.python.org/downloads/macos/)

#### Set up MySQL database

2. Install MySQL Server
   - [MacOS](https://dev.mysql.com/downloads/mysql/)
   - [Windows](https://dev.mysql.com/downloads/installer/)

   During install, set root password and port (default `3306`) to match your `.env` values.

3. [Install MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
   - Open Workbench, create a new connection to `127.0.0.1:3306` using your root credentials.

4. Create database

   In Workbench, open a SQL editor tab against your connection and run:

```sql
CREATE DATABASE kmonitoring;
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

Create a `.env` file at `backend/.env` (`sample.env` no longer exists in the repo, so set it up manually with your DB and secret key values).

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
CustomUser.objects.create_superuser(user_email="admin1@gmail.com", user_username="admin1", user_password="@Password123", user_role="Admin")
quit()
```

Note: `user_role` must be one of `Admin`, `Developer`, `Sales`, `Service`, `Engineer`, `Customer`.

### Frontend Installation

1. [Install NodeJS](https://nodejs.org/en/download/package-manager)
2. [Install PNPM](https://pnpm.io/installation)

```bash
npm install -g pnpm
```

Note: Normally, we can run the command above, if error occur follow PNPM installation guide in website

3. Create `.env.local`

Create a `.env.local` file at `frontend/.env.local` (`sample.env.local` no longer exists in the repo, so set it up manually with your API URL values).

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
│  │  ├─ chart/  # Chart components (factory curve, analytics)
│  │  ├─ table/  # Reusable table components
│  ├─ hook/  # React hooks per domain (pump, engineer, factory_curve, users)
│  ├─ lib/  # Settings and Authentication related files
│  ├─ routes/  # All routes files to render each route, file-base routing
│  │  ├─ _auth/  # Authenticated routes: pump, users, analytic, customers, dashboard, settings
│  ├─ types/  # Typescript Interface, provide types to whole apps
│  ├─ validators/  # All zod types validator
│  ├─ App.jsx
│  ├─ index.css  # Config Shadcn theme here
│  ├─ main.jsx
├─ tsconfig.app.json  # Config typescript here
backend/
├─ core/
│  ├─ settings.py  # Config Django here
│  ├─ api.py  # collect api from whole django apps (registers controllers)
├─ pump_data/
│  ├─ schema/  # Pydantic files
│  ├─ api.py  # Pump / list-of-values related api
├─ factory_curve/
│  ├─ schema/  # Pydantic files
│  ├─ api.py  # Factory curve related api (incl. fetching curves from PEC)
├─ engineer/
│  ├─ schema/  # Pydantic files
│  ├─ report_templates/  # Report generation templates
│  ├─ reports/  # Generated reports
│  ├─ api.py  # Engineering report / Mars related api
│  ├─ report_generate.py  # Report generation logic
│  ├─ check_condition.py  # Condition checks for reports
├─ users/
│  ├─ schemas/  # Pydantic files
│  ├─ signals.py  # Control profile creation
│  ├─ api.py  # Users, companies, customer related api
│  ├─ models.py  # User roles / permissions defined here
```

## Docker

A `docker-compose.yml` is provided at the repo root to run frontend and backend as containers (frontend on port 3000, backend using host networking, reading env from `backend/.env`).
