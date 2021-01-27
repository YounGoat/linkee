#	linkee
__File link management tool__

*linkee* is a tool designed to manage all your setting files 

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/linkee)

##	Get Started

__ATTENTION: Just in case, please backup anything before you `linkee` it unless you are familiar with this tool and be sure that it is safe in your cases.__

```bash
# Install.
npm install -g linkee

# A new command "linkee" will be avaiable.
linkee -h

# Create a folder (named with your favorite).
mkdir my_linkee_home
cd my_linkee_home

# Gather scattered setting files here.
# ATTENTION: Just in case, please backup anything before you `linkee` it.
linkee ~/.bash_profile
linkee ~/.vimrc
# ...

# Display managed links.
linkee --list

# Reset.
linkee --reset .vimrc
```