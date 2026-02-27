# modules/mongodb-atlas/main.tf

resource "mongodbatlas_cluster" "main" {
  project_id = var.project_id
  name       = "${var.app_name}-${var.environment}"
  
  # Provider Settings
  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  provider_region_name        = var.region
  provider_instance_size_name = var.cluster_tier
  
  # Auto-scaling (for paid tiers)
  auto_scaling_disk_gb_enabled = var.cluster_tier != "M0"
  
  # Backup (for paid tiers)
  backup_enabled = var.cluster_tier != "M0"
  
  # Version
  mongo_db_major_version = "7.0"
}

# Database user
resource "mongodbatlas_database_user" "main" {
  username           = "${var.app_name}-user-${var.environment}"
  password           = var.db_password
  project_id         = var.project_id
  auth_database_name = "admin"
  
  roles {
    role_name     = "readWrite"
    database_name = var.database_name
  }
}

# IP Access List (allow from anywhere for now)
resource "mongodbatlas_project_ip_access_list" "main" {
  project_id = var.project_id
  cidr_block = "0.0.0.0/0"
  comment    = "Allow from anywhere - ${var.environment}"
}

# modules/mongodb-atlas/variables.tf
variable "project_id" {
  description = "MongoDB Atlas project ID"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "cluster_tier" {
  description = "MongoDB cluster tier"
  type        = string
  default     = "M0"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "US_EAST_1"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "Database name"
  type        = string
  default     = "internship-portal"
}

# modules/mongodb-atlas/outputs.tf
output "connection_string" {
  description = "MongoDB connection string"
  value       = replace(mongodbatlas_cluster.main.connection_strings[0].standard_srv, "mongodb+srv://", "mongodb+srv://${mongodbatlas_database_user.main.username}:${var.db_password}@")
  sensitive   = true
}

output "cluster_id" {
  description = "MongoDB cluster ID"
  value       = mongodbatlas_cluster.main.cluster_id
}

output "cluster_name" {
  description = "MongoDB cluster name"
  value       = mongodbatlas_cluster.main.name
}
