#!/bin/bash

ASG_NAME='asg-simple-blog-litt.no'
ELB_NAME='simple-blog-1'
ASG_ORG_SIZE=1
ASG_STEP_1_SIZE=2

echo ""
echo "Are you ready to deploy a new version to the production environment..?"
echo ""
read -n 1 -s -p "Press any key to continue"
echo ""

# Launch 1 new server
echo "- Setting ASG: ${ASG_NAME} to ${ASG_STEP_1_SIZE} instances."
aws autoscaling set-desired-capacity --profile ffe --auto-scaling-group-name ${ASG_NAME} --desired-capacity ${ASG_STEP_1_SIZE}
echo "- Sleeping for 30 sec..."
sleep 30

echo ""
echo ""

echo "NOW READ THIS:"
echo "Check the ELB to ensure all new instances are InService before proceeding."
echo "    https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#LoadBalancers"
echo ""

while true; do
    read -p "Are all the new servers up and running? [y/n]:" serversAreRunning
    case "$serversAreRunning" in
        [Yy]|[Yy][Ee][Ss])
            echo ""
            echo "Downsizing cluster to the original size..."
            aws autoscaling set-desired-capacity --profile ffe --auto-scaling-group-name ${ASG_NAME} --desired-capacity ${ASG_ORG_SIZE}
            echo ""
            echo "Check your instances to see that it is the latest versions that are running:"
            echo "    https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances:sort=desc:launchTime"
            echo ""
            echo "A new version has been deployed. Go get yourself some well deserved coffee :)"
            echo ""
            exit 3;;
        [Nn]|[Nn][Oo])
            echo "Skipping and waiting a bit more...";;
        *)
            echo "Wrong input..! Please try again.";;
    esac
done
