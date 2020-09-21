# First step: build the assets
FROM node:lts-alpine AS builder

WORKDIR /
ADD package.json yarn.lock ./
ADD ./apis/sources/package.json ./apis/sources/
ADD ./apis/users/package.json ./apis/users/
ADD ./packages/azure/package.json ./packages/azure/
ADD ./packages/cloudinary/package.json ./packages/cloudinary/
ADD ./packages/core/package.json ./packages/core/
ADD ./packages/fun-ddr/package.json ./packages/fun-ddr/
ADD ./packages/hydra-box-helpers/package.json ./packages/hydra-box-helpers/
ADD ./packages/sparql/package.json ./packages/sparql/

# for every new package foo add
#ADD ./packages/foo/package.json ./packages/foo/

# install and build backend
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn tsc --outDir dist

FROM node:14-alpine

WORKDIR /app

ADD package.json yarn.lock ./
ADD ./apis/sources/package.json ./apis/sources/
ADD ./apis/users/package.json ./apis/users/
ADD ./packages/azure/package.json ./packages/azure/
ADD ./packages/cloudinary/package.json ./packages/cloudinary/
ADD ./packages/core/package.json ./packages/core/
ADD ./packages/fun-ddr/package.json ./packages/fun-ddr/
ADD ./packages/hydra-box-helpers/package.json ./packages/hydra-box-helpers/
ADD ./packages/sparql/package.json ./packages/sparql/

# for every new package foo add
#ADD ./packages/foo/package.json ./packages/foo/

RUN yarn install --production --frozen-lockfile
COPY --from=builder dist/apis ./apis/
COPY --from=builder dist/packages/ ./packages/
COPY ./apis/sources/hydra/*.ttl ./apis/sources/hydra/

RUN apk add --no-cache tini
ENTRYPOINT ["tini", "--", "node"]

USER nobody

WORKDIR /app/apis
CMD ["sources"]
