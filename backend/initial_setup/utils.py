from config import settings


def save_settings_to_env(settings_dict: dict):
    with open(settings.BASE_DIR.joinpath('.env'), 'a') as f:
        f.write('\n')
        for k, v in settings_dict.items():
            f.write(f'{k.upper()}={v}\n')
