from config import settings


def save_settings_to_env(kv: dict):
    with open(settings.BASE_DIR.joinpath('.env'), 'a') as f:
        for k, v in kv.items():
            f.write(f'\n{k.upper()}={v}\n')
