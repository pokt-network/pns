forever stopall
zip -r ${instanceName}.zip prlts_data/**/analytics/data.json
gsutil -m cp -r ${instanceName}.zip gs://prtls-results


gcloud auth activate-service-account --key-file=/etc/google/auth/application_default_credentials.json && forever stopall && zip -r relayer-0-0.zip prlts_data/**/analytics/data.json && gsutil -m cp -r relayer-0-0.zip gs://prtls-results

gcloud compute ssh luis_pokt_network@relayer-0-0 --zone="us-central1-c" --command="gcloud auth activate-service-account --key-file=/etc/google/auth/application_default_credentials.json && forever stopall && zip -r relayer-0-0.zip prlts_data/**/analytics/data.json && gsutil -m cp -r relayer-0-0.zip gs://prtls-results"