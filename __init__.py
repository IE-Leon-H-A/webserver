import logging
from punionica.settings import (
    file_handler,
    console_handler,
    use_console_logger,
    use_file_logger,
    LOG_LVL_WEBSERVER
)

logger = logging.getLogger(__name__)
logger.setLevel(LOG_LVL_WEBSERVER)
if use_file_logger is True:
    logger.addHandler(file_handler)
if use_console_logger is True:
    logger.addHandler(console_handler)
