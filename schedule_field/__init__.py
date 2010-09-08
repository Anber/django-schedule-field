VERSION = (0, 0, 1, 'alpha')
if VERSION[-1] != "final": # pragma: no cover
    __version__ = '.'.join(map(str, VERSION))
else: # pragma: no cover
    __version__ = '.'.join(map(str, VERSION[:-1]))

__author__ = u'Anton Yevzhakov'
__maintainer__ = u'Anton Yevzhakov'
__email__ = 'anber@anber.ru'