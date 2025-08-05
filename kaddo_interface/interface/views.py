from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "interface/index.html")


def my_profile(request):
    return render(request, "interface/my_profile.html")