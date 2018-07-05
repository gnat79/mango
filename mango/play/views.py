from django.http import HttpResponse


def index(request):
    return HttpResponse("Play the 2048 game.")
