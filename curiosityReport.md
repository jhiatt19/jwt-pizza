# Curiosity Report

## Topic: Comparing AWS Cloudfront and Cloudflare as a CDN

### Overview

One of the things I love about computer science is that I can take what I learn in class and implement it on my own personal projects. However, one of the issues with trying to host a bunch of websites is that the cost for doing so can be quite expensive if you are using AWS. For the majority of my websites I don't need all the extra capabilities that Amazon provides like being super elastic because I am just messing around and exploring how many of these systems work. That lead me to Cloudflare. Cloudflare makes hosting your own website much more economically feasible for small projects and helps to keep everything more secure.

### What is Cloudflare?

Cloudflare is a technology company that has specialized in providing security, speed, and low costs to its users. Cloudflare originally started out as a content delivery network (CDN) through there edge network which helps consumers access your website in a data center as close to them as possible. They also help provide security for your website by helping to stop DDoS attacks, malicious bots, and other potential attacks. Recently, they have made strides to offering more services to compete with AWS and one of their main selling points is by keeping costs low.

### Comparing CloudFront and Cloudflare:

| Features    | AWS CloudFront                                                                                                                           | Cloudflare                                                                                                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Security    | AWS Shield Standard: Offers protection from DDoS Attacks Layers 3,4, and 7                                                               | Offers integrated Layers 3-7 DDoS protection for free                                                                                                                                                                               |
| Speed       | Indistinguishable for American users                                                                                                     | Slight edge for global users                                                                                                                                                                                                        |
| Cost        | Application Load Balancer: ~16.20/month + Usage Fee $0.008 per LCU-hour <br> Route 53: $0.50/month <br> EC2 instance: ~$3.71-$8.23/month | Base Load Balancer: $5/month for 2 origin servers and basic failover capabilities + $0.50 per 500,000 DNS queries after the first 500,000                                                                                           |
| Ease of Use | Easy, the services are integrated into each other                                                                                        | Medium, have to add the Cloudflare IP range numbers to your rules for the load balancer, need to install Cloudflare onto your personal server, and requires you to use nginx or another server software to handle hosting the pages |
| Benefits    | Everything is integrated into one console                                                                                                | Get the security benefits of Cloudflare and save money. Even if you use the AWS load balancer you can still save the Route 53 and EC2 instance if you have your own server                                                          |

### How to use Cloudflare:

- Create an account
- Either buy a domain by going to the Domain Tab and searching for your domain OR transfer in a domain you own
- Install Cloudflare on your private server
- Create a Tunnel that communicates with your private server
- Create records for your domain

* Add an access policy on the Cloudflare Dashboard to allow the Github action to work

### Using Github Actions:

Add the Cloudflare Client ID and Secret to your github actions

Use this deploy step in the yml script to deploy to cloudflare instead of S3:

```yml
deploy:
  name: Deploy to Ubuntu
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Download dist artifact
      uses: actions/download-artifact@v4
      with:
        name: package
        path: dist/

    # 1. Install cloudflared so the runner can "see" your tunnel
    - name: Install cloudflared
      run: |
        sudo mkdir -p --mode=0755 /usr/share/keyrings
        curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg
        echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bookworm main" | sudo tee /etc/apt/sources.list.d/cloudflare.list
        sudo apt-get update && sudo apt-get install cloudflared

    # 2. Manual SCP transfer using ProxyCommand
    - name: Copy files to Server via Cloudflare Tunnel
      run: |
        # Set up the SSH key
        echo "${{ secrets.SERVER_SSH_KEY }}" > private_key
        chmod 600 private_key

        # Run SCP with the ProxyCommand
        # We use -r to copy the dist folder contents
        scp -r -i private_key \
          -o StrictHostKeyChecking=no \
          -o "ProxyCommand=cloudflared access ssh --hostname %h --id ${{ secrets.CF_ACCESS_CLIENT_ID }} --secret ${{ secrets.CF_ACCESS_CLIENT_SECRET }}" \
          dist/* <username@hostname:file_location> ex: user@j19server.jordanhiatt.org:/var/www/pizza/
```

### Note:

This specific instance of using cloudflare uses the Cloudflare Tunnel to connect your personal server to Cloudflare. Cloudflare then takes the images and JS files and puts them on their edge network which is the CDN part of this. Doing it this way allows for the tunnel to act as a Shield because even if your home IP address is found, no ports are opened and the only way to communicate with the server is through the tunnel.

### Sources:

[Cloudflare DDoS attacks](https://www.cloudflare.com/learning/ddos/how-to-prevent-ddos-attacks/) <br>
[Cloudflare Load Balancer Costs (Scroll to the Load Balancing part)](https://www.cloudflare.com/personal/) <br>
[Amazon AWS Shield](https://docs.aws.amazon.com/waf/latest/developerguide/ddos-overview.html) <br>
[Comparing CloudFront and CloudFlare](https://www.metaltoad.com/blog/cloudflare-vs-cloudfront#:~:text=Cloudflare%20reports%20broader%20geographic%20coverage,emerging%20markets%20or%20remote%20locations.) <br>
[EC2 Instance Type Costs](https://costcalc.cloudoptimo.com/aws-pricing-calculator/ec2/t4g.nano)
