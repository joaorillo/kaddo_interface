# 🧠 Status

**Last update:** 2025-08-03  
**Status:** Starting to implement the new interface

---

# 🛠️ Tech Stack

**Language**  
- Python 3

**Frameworks**  
- Django 5

**Frontend**  
- HTML / CSS / JavaScript

**Database**  
- PostgreSQL

**API & Integrations**  
- [Kaddô API](https://documenter.getpostman.com/view/36955707/2sA3kSo3Uo)

**Other Tools & Services**  
- Docker  
- Celery + Redis *(for background tasks)*  
- GitHub Actions *(CI/CD)*

---

# 🌐 Overview

**Kaddô** is a startup founded by João Pedro N. Rillo in 2023, born out of a deep frustration with the user experience in supermarket e-commerce platforms. Since then, we've been building technology solutions to not only address these shortcomings but to transform grocery shopping into a true **experience**.

This project is a new version of our interface, integrating several innovative solutions developed over the past few years. Some tools are proprietary and hosted privately on our servers. You may notice parts of the project interacting with our official API (endpoints starting with `https://kaddo.com.br`).

## 🔍 Key Innovations

- **Category-based Interface**  
  Designed to improve user experience in supermarket e-commerce, making it easier to browse and compare products. *(Patent pending)*  
  📄 [More info](./presentations/kaddo_interface.pdf)

- **Custom Search Engine Optimizer**  
  Built specifically for supermarket needs, delivering highly relevant results—solving a pain point still common in Brazilian e-commerce platforms (as of 2025).  
  📄 [More info](./presentations/kaddo_search_engine.pdf)  

  🔎 Try the following queries on our interface and compare the results to any Brazilian supermarket's search engine:  
  - `Leite`  
  - `Papel higiênico`  
  - `Café`  
  - `Nescau`  
  - `Achocolatado líquido`  
  - `Saco de lixo azul`  
  - `Desodorante feminino`  
  - `Chocolate barra`

- **Public API**  
  Access all our core solutions—completely free—including our smart search, personalized to each store’s inventory.  
  🔗 [API Docs](https://documenter.getpostman.com/view/36955707/2sA3kSo3Uo)  
  🗂️ [API Flowchart](./presentations/fluxogram_api_kaddo.pdf)

- **Automated Product Ingestion System**  
  Send us product names not yet in our database, and within minutes, they’re added to our API—categorized and enriched with brand and other details, with over 90% accuracy.

---

# ⚙️ Initial Setup

1. Make sure Python is installed:
    ```bash
    python --version
    ```

2. Create and activate a virtual environment:
    ```bash
    python -m venv venv
    venv\Scripts\activate  # On Windows
    # Or use `source venv/bin/activate` on Linux/Mac
    ```

3. Install project dependencies:
    ```bash
    pip install -r requirements.txt
    ```

---

