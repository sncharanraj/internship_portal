# environments/production/terraform.tfvars

environment          = "production"
mongodb_cluster_tier = "M0" # Free tier
cluster_name = "internship-portal"

# Get these from your providers
mongodb_project_id       = "6985796177194130aaaf8fea"
backend_url              = "https://internship-portal-tzw8.onrender.com"
admin_email              = "charanka21@gmail.com"
uptimerobot_contact_id   = "8125545"

# Note: Sensitive values should be set via environment variables:
# export TF_VAR_mongodb_atlas_public_key="..."
# export TF_VAR_mongodb_atlas_private_key="..."
# export TF_VAR_mongodb_password="..."
# export TF_VAR_vercel_api_token="..."
# export TF_VAR_brevo_api_key="..."
# export TF_VAR_uptimerobot_api_key="..."
