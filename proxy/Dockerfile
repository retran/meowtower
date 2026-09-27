# Caddy's image grants its binary cap_net_bind_service as a file capability.
# With every capability dropped and no-new-privileges set, the kernel refuses
# to run such a binary, so strip it: Caddy listens on 8443 and needs none.
FROM caddy:2
RUN apk add --no-cache libcap && setcap -r /usr/bin/caddy && apk del libcap
