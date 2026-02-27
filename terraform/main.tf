locals {
  app_name = "internship-portal"
}

# Reference existing cluster (read-only)
data "mongodbatlas_cluster" "existing" {
  project_id = var.mongodb_project_id
  name       = "Cluster0"
}

# Generate secure password
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Create new database user (this we CAN manage)
resource "mongodbatlas_database_user" "terraform_user" {
  username           = "${local.app_name}-terraform-user"
  password           = random_password.db_password.result
  project_id         = var.mongodb_project_id
  auth_database_name = "admin"
  
  roles {
    role_name     = "readWrite"
    database_name = local.app_name
  }
}

# IP Access List (this we CAN manage)
resource "mongodbatlas_project_ip_access_list" "terraform" {
  project_id = var.mongodb_project_id
  cidr_block = "0.0.0.0/0"
  comment    = "Managed by Terraform - Allow from anywhere"
}
