# 🚀 MySaaSProject Deployment Guide

## 📋 Overview
This guide will help you deploy your Docker-based SaaS application to a production server at the lowest possible cost.

## 💰 Cost-Effective Hosting Options

### 🏆 RECOMMENDED: Hostinger India - SUPPORTS UPI/PAYTM
- **Cost**: ₹399/month (~$5/month)
- **Specs**: 1 vCPU, 1GB RAM, 20GB SSD
- **Best for**: India users - Mumbai data center (10-20ms latency)
- **Payment**: ✅ UPI, ✅ Paytm, ✅ Net Banking, ✅ Cards
- **Sign up**: [Hostinger India](https://hostinger.in)

### 🌍 **Alternative: HostGator India - SUPPORTS UPI/PAYTM**
- **Cost**: ₹499/month (~$6/month)
- **Specs**: 1 vCPU, 1GB RAM, 25GB SSD
- **Best for**: India users - Mumbai data center (10-20ms latency)
- **Payment**: ✅ UPI, ✅ Paytm, ✅ Net Banking, ✅ Cards
- **Sign up**: [HostGator India](https://hostgator.in)

### 🌍 **Alternative: DigitalOcean (Singapore) - Use PayPal**
- **Cost**: $4/month (basic droplet)
- **Specs**: 1 vCPU, 512MB RAM, 10GB SSD
- **Best for**: India users - lowest latency (50-80ms)
- **Payment**: Use PayPal to bypass card E-mandate restrictions
- **Sign up**: [DigitalOcean](https://www.digitalocean.com/)

### 🌍 **Alternative: AWS (Mumbai)**
- **Cost**: $8-12/month (t3.micro)
- **Specs**: 2 vCPUs, 1GB RAM, 8GB SSD
- **Best for**: Local data center (20-40ms latency)
- **Sign up**: [AWS Mumbai](https://aws.amazon.com/)

### 💡 Other Indian Options (All Support UPI/Paytm)
1. **BigRock**: ₹299/month (1 vCPU, 512MB RAM) - Mumbai (10-20ms latency)
2. **GoDaddy India**: ₹499/month (1 vCPU, 1GB RAM) - Mumbai (10-20ms latency)
3. **Namecheap India**: ₹399/month (1 vCPU, 1GB RAM) - Mumbai (10-20ms latency)

### 💡 International Options (Require Cards/PayPal)
1. **Vultr**: $3.50/month (1 vCPU, 512MB RAM) - Singapore (50-80ms latency)
2. **Linode**: $5/month (2 vCPUs, 1GB RAM) - Singapore (50-80ms latency)
3. **Contabo VPS**: $5.99/month (4 vCPUs, 8GB RAM) - Singapore (60-90ms latency)

## 🛠️ Prerequisites

### 1. Server Requirements
- **Minimum**: 1 vCPU, 512MB RAM, 10GB SSD (DigitalOcean Basic)
- **Recommended**: 1 vCPU, 1GB RAM, 25GB SSD (DigitalOcean Regular)
- **For High Traffic**: 2 vCPUs, 2GB RAM, 50GB SSD (DigitalOcean CPU-Optimized)
- **OS**: Ubuntu 22.04 LTS

### 2. Domain Setup
- Domain purchased from GoDaddy ✅
- DNS access to configure A records

### 3. Required Accounts
- AWS S3 account (for file uploads)
- GitHub account (for code repository)

## 🚀 Step-by-Step Deployment

### Step 1: Server Setup

1. **Create a VPS instance**:
   ```bash
   # Choose Ubuntu 22.04 LTS
   # Select recommended specs: 2 vCPUs, 4GB RAM, 40GB SSD
   ```

2. **Connect to your server**:
   ```bash
   ssh root@your-server-ip
   ```

3. **Update system and install Docker**:
   ```bash
   # Update system
   apt update && apt upgrade -y

   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh

   # Install Docker Compose
   apt install docker-compose-plugin -y

   # Add user to docker group (optional)
   usermod -aG docker $USER
   ```

### Step 2: Domain Configuration

1. **Configure DNS in GoDaddy**:
   - Login to GoDaddy DNS management
   - Add A record: `@` → `your-server-ip`
   - Add A record: `www` → `your-server-ip`
   - Wait for DNS propagation (5-30 minutes)

2. **Verify DNS propagation**:
   ```bash
   nslookup yourdomain.com
   ```

### Step 3: Code Deployment

1. **Clone your repository**:
   ```bash
   git clone https://github.com/yourusername/mysaasproject.git
   cd mysaasproject
   ```

2. **Set up environment variables**:
   ```bash
   # Copy production environment template
   cp env.prod.example .env.prod

   # Edit with your actual values
   nano .env.prod
   ```

3. **Configure environment variables**:
   ```bash
   # Required variables in .env.prod
   DOMAIN=yourdomain.com
   SSL_EMAIL=your-email@example.com
   POSTGRES_PASSWORD=your_secure_password_here
   SECRET_KEY_BASE=your_rails_secret_key_base
   JWT_SECRET_KEY=your_jwt_secret_key
   S3_ACCESS_KEY_ID=your_aws_access_key
   S3_SECRET_ACCESS_KEY=your_aws_secret_key
   S3_BUCKET=your_s3_bucket_name
   S3_REGION=us-east-1
   ```

### Step 4: Deploy Application

1. **Deploy with Docker Compose**:
   ```bash
   # Build and start services
   docker-compose -f docker-compose.prod.yml up -d

   # Check service status
   docker-compose -f docker-compose.prod.yml ps
   ```

2. **Run database migrations**:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend rails db:migrate
   ```

3. **Set up SSL certificate**:
   ```bash
   # Make SSL setup script executable
   chmod +x scripts/setup-ssl.sh

   # Run SSL setup
   DOMAIN=yourdomain.com SSL_EMAIL=your@email.com ./scripts/setup-ssl.sh
   ```

### Step 5: Verification

1. **Test your application**:
   ```bash
   # Check if services are running
   curl http://localhost/health

   # Test HTTPS
   curl https://yourdomain.com/health
   ```

2. **Access your application**:
   - Frontend: `https://yourdomain.com`
   - API: `https://yourdomain.com/api`

## 🔧 Maintenance & Updates

### Daily Operations
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

### Application Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations if needed
docker-compose -f docker-compose.prod.yml exec backend rails db:migrate
```

### SSL Certificate Renewal
```bash
# Manual renewal
./scripts/setup-ssl.sh renew

# Check renewal status
docker-compose -f docker-compose.prod.yml run --rm certbot certificates
```

## 💾 Backup Strategy

### Database Backup
```bash
# Create backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres mysaasproject_production > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U postgres mysaasproject_production < backup_file.sql
```

### Automated Backups (Optional)
```bash
# Add to crontab for daily backups
0 2 * * * cd /path/to/your/app && docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres mysaasproject_production > backups/backup_$(date +\%Y\%m\%d).sql
```

## 📊 Monitoring & Performance

### Basic Monitoring
```bash
# Check resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h
```

### Log Management
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# View nginx logs
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## 🔒 Security Checklist

- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key authentication enabled
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Database password is strong and unique
- [ ] Environment variables properly secured
- [ ] Regular security updates applied
- [ ] Backup strategy implemented

## 🆘 Troubleshooting

### Common Issues

1. **Services not starting**:
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs
   
   # Check disk space
   df -h
   ```

2. **SSL certificate issues**:
   ```bash
   # Check certificate status
   docker-compose -f docker-compose.prod.yml run --rm certbot certificates
   
   # Test SSL
   ./scripts/setup-ssl.sh test
   ```

3. **Database connection issues**:
   ```bash
   # Check database logs
   docker-compose -f docker-compose.prod.yml logs postgres
   
   # Test connection
   docker-compose -f docker-compose.prod.yml exec backend rails db:migrate:status
   ```

## 💰 Total Monthly Cost Estimate

### Minimal Setup (DigitalOcean Singapore)
- **VPS**: $4/month (Basic Droplet)
- **Domain**: $0 (already purchased)
- **SSL Certificate**: $0 (Let's Encrypt)
- **AWS S3**: ~$1-5/month (depending on usage)
- **Total**: ~$5-9/month

### With Monitoring & Backups
- **VPS**: $4/month (DigitalOcean Basic)
- **Domain**: $0
- **SSL**: $0
- **AWS S3**: ~$1-5/month
- **Monitoring**: $0 (basic server monitoring)
- **Total**: ~$5-9/month

## 📞 Support

For issues specific to this deployment:
1. Check the troubleshooting section above
2. Review Docker and application logs
3. Verify environment variables are correctly set
4. Ensure DNS propagation is complete

## 🎉 Congratulations!

Your SaaS application should now be live at `https://yourdomain.com`!

Remember to:
- Monitor your application regularly
- Keep backups of your database
- Update dependencies periodically
- Monitor server resources and costs

---

## 💡 Additional Resources

For detailed setup guides specific to different hosting providers:
- See `DIGITALOCEAN_SETUP_GUIDE.md` for DigitalOcean-specific instructions
- See `env.prod.example` for all environment variable templates
- See `PRE_DEPLOYMENT_CHECKLIST.md` for comprehensive deployment checklist

Remember to generate strong, unique secrets for production and never commit them to Git!