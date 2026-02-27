output "mongodb_connection_string" {
  description = "MongoDB connection string with Terraform user"
  value = replace(
    data.mongodbatlas_cluster.existing.connection_strings[0].standard_srv,
    "mongodb+srv://",
    "mongodb+srv://${mongodbatlas_database_user.terraform_user.username}:${random_password.db_password.result}@"
  )
  sensitive = true
}

output "cluster_name" {
  description = "MongoDB cluster name"
  value       = data.mongodbatlas_cluster.existing.name
}

output "cluster_state" {
  description = "MongoDB cluster state"
  value       = data.mongodbatlas_cluster.existing.state_name
}

output "terraform_user" {
  description = "Database username created by Terraform"
  value       = mongodbatlas_database_user.terraform_user.username
}

output "database_password" {
  description = "Database password (sensitive)"
  value       = random_password.db_password.result
  sensitive   = true
}

output "summary" {
  description = "Deployment summary"
  value = <<-EOT
    
    ✅ Terraform Configuration Applied Successfully!
    
    📊 Infrastructure Status:
    ─────────────────────────────────────
    Cluster:      ${data.mongodbatlas_cluster.existing.name} (existing, not managed)
    State:        ${data.mongodbatlas_cluster.existing.state_name}
    New User:     ${mongodbatlas_database_user.terraform_user.username}
    IP Access:    0.0.0.0/0 (allow from anywhere)
    
    📋 Get Connection String:
    ─────────────────────────────────────
    terraform output -raw mongodb_connection_string
    
    🔐 Get Password:
    ─────────────────────────────────────
    terraform output -raw database_password
    
    💡 What Terraform Manages:
    ─────────────────────────────────────
    ✅ Database users
    ✅ IP access lists
    ✅ Passwords (auto-generated)
    ❌ Cluster itself (free tier limitation)
    
  EOT
}
