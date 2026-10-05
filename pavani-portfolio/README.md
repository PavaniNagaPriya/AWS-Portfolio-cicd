# Pavani Naga Priya Gali — Portfolio

Personal portfolio website, a static site hosted on **Amazon S3** and deployed automatically with **GitHub Actions** on every push to `main`.

## Architecture

```
  git push (main)
        │
        ▼
┌──────────────────┐   aws s3 sync    ┌──────────────────────┐        ┌───────────┐
│  GitHub Actions  │ ───────────────▶ │  Amazon S3 bucket    │ ─────▶ │  Visitor  │
│  deploy.yml      │                  │  (static website     │        │  browser  │
└──────────────────┘                  │   hosting)           │        └───────────┘
                                      └──────────────────────┘
                                         (optional CloudFront + HTTPS in front)
```

## Project structure

```
pavani-portfolio/
├── .github/workflows/deploy.yml   # CI/CD: sync website/ to S3 on push to main
├── README.md
└── website/                       # everything in here is uploaded to S3
    ├── index.html                 # all sections: Home, About, Projects, Achievements, Contact
    └── src/
        ├── app.js                 # section nav, theme toggle, typing effect, particles, contact form
        ├── styles/styles.css
        └── docs/Pavani_Naga_Priya_Gali_Resume.pdf
```

## Run locally

No build step needed. Open `website/index.html` in a browser, or serve the folder:

```bash
npx serve website
```

## Deploy to AWS

### 1. Create the S3 bucket
1. S3 → **Create bucket** (e.g. `pavani-portfolio`), pick a region (e.g. `ap-south-1`).
2. Untick **Block all public access** and acknowledge.
3. Bucket → **Properties** → **Static website hosting** → Enable, index document `index.html`.
4. Bucket → **Permissions** → **Bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::pavani-portfolio/*"
  }]
}
```

### 2. Create an IAM user for GitHub Actions
Give it only what the pipeline needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::pavani-portfolio" },
    { "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject", "s3:GetObject"], "Resource": "arn:aws:s3:::pavani-portfolio/*" }
  ]
}
```

Create an access key for this user (use case: *Application running outside AWS*).

### 3. Add GitHub repository secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Example |
|---|---|
| `AWS_ACCESS_KEY_ID` | from step 2 |
| `AWS_SECRET_ACCESS_KEY` | from step 2 |
| `AWS_REGION` | `ap-south-1` |
| `AWS_S3_BUCKET` | `pavani-portfolio` |
| `CLOUDFRONT_DISTRIBUTION_ID` | *(optional)* only if you put CloudFront in front |

### 4. Push
Push to `main` (or run the workflow manually from the **Actions** tab). The site is live at the bucket's
*Static website hosting* endpoint, e.g. `http://pavani-portfolio.s3-website.ap-south-1.amazonaws.com`.

## Customising
- **Social links:** search `index.html` for `TODO` and add your LinkedIn / GitHub URLs.
- **Skill levels:** the percentages in *My Skills* are self-assessed — adjust the `--w` values and labels.
- **Resume:** replace `website/src/docs/Pavani_Naga_Priya_Gali_Resume.pdf` with the latest version (keep the file name).
